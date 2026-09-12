from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.security import get_current_user_id

router = APIRouter(
    prefix="/api/location",
    tags=["Location"],
)


class LocationRequest(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


@router.post("/resolve")
def resolve_location(
    data: LocationRequest,
    user_id: int = Depends(get_current_user_id),
):
    params = urlencode(
        {
            "lat": data.latitude,
            "lon": data.longitude,
            "format": "jsonv2",
            "zoom": 10,
            "addressdetails": 1,
        }
    )

    url = f"https://nominatim.openstreetmap.org/reverse?{params}"

    request = Request(
        url,
        headers={
            "User-Agent": "DisasterSafe/1.0",
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            result = json.loads(
                response.read().decode("utf-8")
            )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to resolve location: {exc}",
        )

    address = result.get("address", {})

    return {
        "latitude": data.latitude,
        "longitude": data.longitude,
        "display_name": result.get("display_name"),
        "city": (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or address.get("municipality")
        ),
        "district": address.get("state_district"),
        "state": address.get("state"),
        "country": address.get("country"),
        "country_code": address.get("country_code"),
    }