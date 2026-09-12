import json
import math
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.security import get_current_user_id


router = APIRouter(
    prefix="/api/disasters",
    tags=["Disasters"],
)


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(value):
    if value is None:
        return ""

    return " ".join(
        str(value)
        .lower()
        .replace(",", " ")
        .replace("-", " ")
        .split()
    )


# ============================================================
# DISTANCE CALCULATION
# ============================================================

def calculate_distance_km(
    latitude_1,
    longitude_1,
    latitude_2,
    longitude_2,
):
    earth_radius_km = 6371.0

    lat1 = math.radians(latitude_1)
    lat2 = math.radians(latitude_2)

    dlat = math.radians(latitude_2 - latitude_1)
    dlon = math.radians(longitude_2 - longitude_1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a),
    )

    return earth_radius_km * c


# ============================================================
# LOCATION MATCHING
# ============================================================

def location_matches_alert(
    alert,
    district=None,
    state=None,
    latitude=None,
    longitude=None,
):
    """
    Match an official SACHET alert to the user's location.

    Priority:

    1. Exact district match.
    2. Geographic distance using alert centroid.
    3. area_covered is treated as square kilometres.

    IMPORTANT:
    State is NOT used as a broad fallback.

    This prevents an alert from another district/state
    from being displayed just because it is in the same
    state.
    """

    area_description = normalize_text(
        alert.get("area_description")
        or alert.get("area")
    )

    district_text = normalize_text(district)

    # --------------------------------------------------------
    # 1. EXACT DISTRICT MATCH
    # --------------------------------------------------------

    if district_text:
        if district_text in area_description:
            return True

    # --------------------------------------------------------
    # 2. GEOGRAPHIC MATCH
    # --------------------------------------------------------

    centroid = alert.get("centroid")
    area_covered = alert.get("area_covered")

    if (
        centroid
        and latitude is not None
        and longitude is not None
    ):
        try:
            parts = str(centroid).split(",")

            if len(parts) == 2:

                # SACHET centroid format:
                # longitude,latitude

                alert_longitude = float(
                    parts[0].strip()
                )

                alert_latitude = float(
                    parts[1].strip()
                )

                distance_km = calculate_distance_km(
                    latitude,
                    longitude,
                    alert_latitude,
                    alert_longitude,
                )

                # ------------------------------------------------
                # area_covered is SQUARE KILOMETRES.
                #
                # Approximate it as a circle:
                #
                # area = pi * r²
                # r = sqrt(area / pi)
                # ------------------------------------------------

                if area_covered is not None:

                    covered_area_km2 = float(
                        area_covered
                    )

                    if covered_area_km2 > 0:

                        coverage_radius_km = math.sqrt(
                            covered_area_km2 / math.pi
                        )

                        # Small buffer for GPS/location uncertainty
                        coverage_radius_km += 5

                        if distance_km <= coverage_radius_km:
                            return True

                # ------------------------------------------------
                # If SACHET doesn't provide area_covered,
                # use a conservative 15 km radius.
                # ------------------------------------------------

                else:

                    if distance_km <= 15:
                        return True

        except (
            ValueError,
            TypeError,
            ZeroDivisionError,
        ):
            pass

    # --------------------------------------------------------
    # IMPORTANT:
    # DO NOT MATCH BY STATE ALONE.
    # --------------------------------------------------------

    return False


# ============================================================
# WEATHER
# ============================================================

@router.get("/weather")
def get_weather(
    latitude: float = Query(...),
    longitude: float = Query(...),
    user_id: int = Depends(get_current_user_id),
):
    params = urlencode(
        {
            "latitude": latitude,
            "longitude": longitude,
            "current": (
                "temperature_2m,"
                "relative_humidity_2m,"
                "apparent_temperature,"
                "wind_speed_10m,"
                "weather_code"
            ),
            "timezone": "auto",
        }
    )

    url = (
        "https://api.open-meteo.com/v1/forecast?"
        + params
    )

    request = Request(
        url,
        headers={
            "User-Agent": "DisasterSafe/1.0"
        },
    )

    try:

        with urlopen(
            request,
            timeout=10,
        ) as response:

            data = json.loads(
                response.read().decode("utf-8")
            )

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to fetch weather data: {exc}",
        )

    current = data.get("current", {})

    weather_code = current.get(
        "weather_code"
    )

    weather_description = (
        "Clear"
        if weather_code == 0
        else "Mainly clear"
        if weather_code in [1, 2]
        else "Cloudy"
        if weather_code == 3
        else "Rain / showers"
        if weather_code in range(51, 68)
        else "Snow"
        if weather_code in range(71, 78)
        else "Thunderstorm"
        if weather_code in range(95, 100)
        else "Current weather"
    )

    return {
        "latitude": latitude,
        "longitude": longitude,
        "temperature": current.get(
            "temperature_2m"
        ),
        "feels_like": current.get(
            "apparent_temperature"
        ),
        "humidity": current.get(
            "relative_humidity_2m"
        ),
        "wind_speed": current.get(
            "wind_speed_10m"
        ),
        "description": weather_description,
        "alert": None,
        "severity": None,
    }


# ============================================================
# OFFICIAL SACHET / NDMA ALERTS
# ============================================================

@router.get("/official-alerts")
def get_official_alerts(
    latitude: float = Query(...),
    longitude: float = Query(...),
    district: str | None = Query(None),
    state: str | None = Query(None),
    user_id: int = Depends(get_current_user_id),
):

    # --------------------------------------------------------
    # OFFICIAL SACHET MACHINE-READABLE ENDPOINT
    # --------------------------------------------------------

    url = (
        "https://sachet.ndma.gov.in/"
        "cap_public_website/"
        "FetchAllAlertDetails"
    )

    request = Request(
        url,
        headers={
            "User-Agent": (
                "DisasterPreparednessAlertSystem/1.0"
            ),
            "Accept": "application/json",
        },
    )

    # --------------------------------------------------------
    # FETCH SACHET DATA
    # --------------------------------------------------------

    try:

        with urlopen(
            request,
            timeout=20,
        ) as response:

            raw_data = response.read().decode(
                "utf-8",
                errors="replace",
            )

            content_type = response.headers.get(
                "Content-Type",
                "",
            )

    except HTTPError as exc:

        raise HTTPException(
            status_code=502,
            detail=(
                "SACHET official alert service returned "
                f"HTTP {exc.code}."
            ),
        )

    except URLError as exc:

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to connect to SACHET official "
                f"alert service: {exc.reason}"
            ),
        )

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch SACHET official "
                f"alerts: {exc}"
            ),
        )

    # --------------------------------------------------------
    # CHECK EMPTY RESPONSE
    # --------------------------------------------------------

    if not raw_data.strip():

        raise HTTPException(
            status_code=502,
            detail=(
                "SACHET official alert service returned "
                "an empty response."
            ),
        )

    # --------------------------------------------------------
    # PARSE JSON SAFELY
    # --------------------------------------------------------

    try:

        data = json.loads(raw_data)

    except json.JSONDecodeError:

        # Don't expose the entire response.
        preview = raw_data[:200].replace(
            "\n",
            " ",
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "SACHET returned a non-JSON response. "
                f"Response preview: {preview}"
            ),
        )

    # --------------------------------------------------------
    # DETERMINE ALERT LIST
    # --------------------------------------------------------

    if isinstance(data, list):

        alerts_data = data

    elif isinstance(data, dict):

        # Different versions of the endpoint may return
        # alerts under different keys.

        alerts_data = (
            data.get("alerts")
            or data.get("data")
            or data.get("results")
            or data.get("alert")
            or []
        )

    else:

        alerts_data = []

    if not isinstance(
        alerts_data,
        list,
    ):

        alerts_data = []

    # --------------------------------------------------------
    # FILTER ALERTS
    # --------------------------------------------------------

    matched_alerts = []

    for alert in alerts_data:

        if not isinstance(
            alert,
            dict,
        ):
            continue

        if location_matches_alert(
            alert,
            district=district,
            state=state,
            latitude=latitude,
            longitude=longitude,
        ):

            matched_alerts.append(
                {
                    "identifier": alert.get(
                        "identifier"
                    ),

                    "event": (
                        alert.get("event")
                        or alert.get(
                            "disaster_type"
                        )
                    ),

                    "headline": (
                        alert.get("headline")
                        or alert.get(
                            "warning_message"
                        )
                    ),

                    "description": alert.get(
                        "description"
                    ),

                    "urgency": alert.get(
                        "urgency"
                    ),

                    "severity": alert.get(
                        "severity"
                    ),

                    "severity_level": alert.get(
                        "severity_level"
                    ),

                    "severity_color": alert.get(
                        "severity_color"
                    ),

                    "certainty": alert.get(
                        "certainty"
                    ),

                    "area": (
                        alert.get(
                            "area_description"
                        )
                        or alert.get("area")
                    ),

                    "effective_start_time": alert.get(
                        "effective_start_time"
                    ),

                    "effective_end_time": alert.get(
                        "effective_end_time"
                    ),

                    "alert_source": alert.get(
                        "alert_source"
                    ),

                    "centroid": alert.get(
                        "centroid"
                    ),

                    "area_covered": alert.get(
                        "area_covered"
                    ),

                    "source": (
                        "SACHET - National Disaster "
                        "Management Authority"
                    ),

                    "source_type": "official",

                    "latitude": latitude,
                    "longitude": longitude,
                }
            )

    # --------------------------------------------------------
    # RETURN RESULT
    # --------------------------------------------------------

    return {
        "source": (
            "SACHET - National Disaster "
            "Management Authority"
        ),

        "source_type": "official",

        "feed_type": "active_alerts",

        "latitude": latitude,

        "longitude": longitude,

        "district": district,

        "state": state,

        "total_active_alerts": len(
            alerts_data
        ),

        "alert_count": len(
            matched_alerts
        ),

        "alerts": matched_alerts,
    }