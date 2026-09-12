import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../../services/api'
import { getCurrentLocation } from '../../services/location'
import type { UserLocation } from '../../services/location'


// =========================================================
// TYPES
// =========================================================

type WeatherData = {
  city: string
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  description: string
  alert: string
  severity: string
}


type ResolvedLocation = {
  city: string | null
  district: string | null
  state: string | null
}


type OfficialAlert = {
  identifier?: string | number | null
  event: string | null
  headline: string | null
  description: string | null
  urgency: string | null
  severity: string | null
  severity_level?: string | null
  severity_color?: string | null
  certainty: string | null
  area: string | null
  effective_start_time?: string | null
  effective_end_time?: string | null
  alert_source?: string | null
  centroid?: string | null
  area_covered?: string | number | null
  source: string
  source_type: string
  latitude: number
  longitude: number
}


type OfficialAlertsResponse = {
  source: string
  source_type: string
  feed_type?: string
  latitude: number
  longitude: number
  district: string | null
  state: string | null
  total_active_alerts?: number
  alerts: OfficialAlert[]
  alert_count: number
}


// =========================================================
// COMPONENT
// =========================================================

function DisastersPage() {

  // =======================================================
  // LOCATION
  // =======================================================

  const [location, setLocation] =
    useState<UserLocation | null>(null)

  const [locationLoading, setLocationLoading] =
    useState(false)

  const [locationError, setLocationError] =
    useState('')

  const [resolvedLocation, setResolvedLocation] =
    useState<ResolvedLocation>({
      city: null,
      district: null,
      state: null,
    })


  // =======================================================
  // WEATHER
  // =======================================================

  const [weather, setWeather] =
    useState<WeatherData | null>(null)

  const [loading, setLoading] =
    useState(true)


  // =======================================================
  // OFFICIAL ALERTS
  // =======================================================

  const [officialAlerts, setOfficialAlerts] =
    useState<OfficialAlertsResponse | null>(null)

  const [alertLoading, setAlertLoading] =
    useState(false)

  const [alertError, setAlertError] =
    useState('')


  // =======================================================
  // ALERT NOTIFICATIONS / AUTO REFRESH
  // =======================================================

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(false)

  const previousAlertIds =
    useRef<Set<string>>(new Set())

  const hasLoadedAlertsOnce =
    useRef(false)

  const [lastAlertCheck, setLastAlertCheck] =
    useState<Date | null>(null)


  // =======================================================
  // NOTIFICATION PERMISSION
  // =======================================================

  const enableNotifications = async () => {

    if (!('Notification' in window)) {

      alert(
        'Browser notifications are not supported by this browser.',
      )

      return
    }

    try {

      const permission =
        await Notification.requestPermission()

      if (permission === 'granted') {

        setNotificationsEnabled(true)

        new Notification(
          'DisasterSafe Notifications Enabled',
          {
            body:
              'You will receive notifications when a new official disaster alert is detected for your location.',
          },
        )

      } else {

        setNotificationsEnabled(false)

        alert(
          'Notification permission was not granted. You can enable it from your browser settings.',
        )
      }

    } catch (error) {

      console.error(
        'Notification permission error:',
        error,
      )
    }
  }


  // =======================================================
  // FETCH OFFICIAL ALERTS
  // =======================================================

  const fetchOfficialAlerts = async (
    currentLocation: UserLocation,
    currentResolvedLocation: ResolvedLocation,
    showLoading = true,
    notifyOnNewAlerts = false,
  ) => {

    if (showLoading) {
      setAlertLoading(true)
    }

    setAlertError('')

    try {

      const response =
        await api.get(
          '/api/disasters/official-alerts',
          {
            params: {
              latitude:
                currentLocation.latitude,

              longitude:
                currentLocation.longitude,

              district:
                currentResolvedLocation.district,

              state:
                currentResolvedLocation.state,
            },
          },
        )

      const data: OfficialAlertsResponse =
        response.data

      setOfficialAlerts(data)

      setLastAlertCheck(new Date())

      const alerts =
        data.alerts || []

      const currentAlertIds =
        new Set<string>()

      for (const alert of alerts) {

        const alertId = String(
          alert.identifier ||
            `${alert.event || 'alert'}-${alert.headline || alert.description || ''}-${alert.effective_start_time || ''}`,
        )

        currentAlertIds.add(
          alertId,
        )

        // Notify only about NEW alerts.
        // Existing alerts are not notified on first load.
        if (
          notifyOnNewAlerts &&
          hasLoadedAlertsOnce.current &&
          !previousAlertIds.current.has(
            alertId,
          ) &&
          notificationsEnabled &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {

          new Notification(
            `🚨 ${alert.event || 'Official Disaster Alert'}`,
            {
              body:
                alert.headline ||
                alert.description ||
                `Official alert detected near ${
                  currentResolvedLocation.district ||
                  'your location'
                }.`,
            },
          )
        }
      }

      // Remember current alerts.
      if (!hasLoadedAlertsOnce.current) {
        hasLoadedAlertsOnce.current = true
      }

      previousAlertIds.current =
        currentAlertIds

    } catch (error) {

      console.error(
        'Failed to load official alerts:',
        error,
      )

      setAlertError(
        'Unable to load official government alerts.',
      )

    } finally {

      if (showLoading) {
        setAlertLoading(false)
      }
    }
  }


  // =======================================================
  // GET CURRENT LOCATION
  // =======================================================

  const handleGetLocation = async () => {

    setLocationLoading(true)
    setLocationError('')

    try {

      // ---------------------------------------------------
      // 1. Get real GPS coordinates
      // ---------------------------------------------------

      const userLocation =
        await getCurrentLocation()

      setLocation(
        userLocation,
      )


      // ---------------------------------------------------
      // 2. Get weather for ACTUAL GPS coordinates
      // ---------------------------------------------------

      setLoading(true)

      try {

        const weatherResponse =
          await api.get(
            '/api/disasters/weather',
            {
              params: {
                latitude:
                  userLocation.latitude,

                longitude:
                  userLocation.longitude,
              },
            },
          )

        setWeather(
          weatherResponse.data,
        )

      } catch (error) {

        console.error(
          'Failed to load current-location weather:',
          error,
        )

      } finally {

        setLoading(false)
      }


      // ---------------------------------------------------
      // 3. Reverse-geocode GPS coordinates
      // ---------------------------------------------------

      const locationResponse =
        await api.post(
          '/api/location/resolve',
          {
            latitude:
              userLocation.latitude,

            longitude:
              userLocation.longitude,
          },
        )


      const newResolvedLocation: ResolvedLocation = {
        city:
          locationResponse.data.city,

        district:
          locationResponse.data.district,

        state:
          locationResponse.data.state,
      }

      setResolvedLocation(
        newResolvedLocation,
      )


      console.log(
        'Resolved location:',
        locationResponse.data,
      )


      // ---------------------------------------------------
      // 4. Get official SACHET alerts
      // ---------------------------------------------------

      await fetchOfficialAlerts(
        userLocation,
        newResolvedLocation,
        true,
        false,
      )

    } catch (error) {

      console.error(
        'Location error:',
        error,
      )

      setLocationError(
        error instanceof Error
          ? error.message
          : 'Unable to retrieve your location.',
      )

    } finally {

      setLocationLoading(false)
    }
  }


  // =======================================================
  // AUTOMATIC OFFICIAL ALERT REFRESH
  // =======================================================

  useEffect(() => {

    if (
      !location ||
      !resolvedLocation.district &&
      !resolvedLocation.state
    ) {
      return
    }

    const checkAlerts = () => {

      fetchOfficialAlerts(
        location,
        resolvedLocation,
        false,
        true,
      )
    }

    // Check immediately.
    checkAlerts()

    // Check every 60 seconds.
    const interval =
      window.setInterval(
        checkAlerts,
        60 * 1000,
      )

    return () => {

      window.clearInterval(
        interval,
      )
    }

  }, [
    location,
    resolvedLocation.district,
    resolvedLocation.state,
    notificationsEnabled,
  ])


  // =======================================================
  // INITIAL WEATHER
  // =======================================================

  useEffect(() => {

    const fetchWeather =
      async () => {

        try {

          const response =
            await api.get(
              '/api/disasters/weather',
            )

          setWeather(
            response.data,
          )

        } catch (error) {

          console.error(
            'Failed to load weather:',
            error,
          )

        } finally {

          setLoading(false)
        }
      }


    fetchWeather()

  }, [])


  // =======================================================
  // DISASTER TYPES
  // =======================================================

  const disasters = [

    {
      icon: '🌊',
      title: 'Flood',
      description:
        'Learn about flood risks, warning signs, preparedness, and safety actions.',
    },

    {
      icon: '🌍',
      title: 'Earthquake',
      description:
        'Understand earthquake risks and what to do before, during, and after an earthquake.',
    },

    {
      icon: '🌀',
      title: 'Cyclone',
      description:
        'Stay prepared for strong winds, heavy rainfall, and cyclone-related hazards.',
    },

    {
      icon: '🔥',
      title: 'Fire',
      description:
        'Learn fire prevention, evacuation procedures, and emergency safety measures.',
    },

    {
      icon: '⛈️',
      title: 'Thunderstorm',
      description:
        'Understand lightning and severe-weather risks and how to stay safe.',
    },

    {
      icon: '🌡️',
      title: 'Heatwave',
      description:
        'Learn how to prepare for extreme temperatures and heat-related risks.',
    },

  ]


  // =======================================================
  // WEATHER SEVERITY STYLE
  // =======================================================

  const getSeverityStyle = () => {

    if (!weather) {
      return 'border-gray-200 bg-gray-50'
    }

    if (
      weather.severity === 'high'
    ) {
      return 'border-red-200 bg-red-50'
    }

    if (
      weather.severity === 'moderate'
    ) {
      return 'border-yellow-200 bg-yellow-50'
    }

    return 'border-green-200 bg-green-50'
  }


  // =======================================================
  // OFFICIAL ALERT STYLE
  // =======================================================

  const getAlertStyle = (
    severity: string | null,
  ) => {

    const value =
      severity?.toLowerCase()

    if (
      value === 'extreme' ||
      value === 'red'
    ) {
      return 'border-red-300 bg-red-50'
    }

    if (
      value === 'severe' ||
      value === 'orange'
    ) {
      return 'border-orange-300 bg-orange-50'
    }

    if (
      value === 'moderate' ||
      value === 'yellow'
    ) {
      return 'border-yellow-300 bg-yellow-50'
    }

    return 'border-blue-200 bg-blue-50'
  }


  // =======================================================
  // PAGE
  // =======================================================

  return (

    <div className="min-h-screen bg-gray-50">


      {/* =================================================
          HEADER
      ================================================== */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="text-xl font-bold text-gray-900"
          >
            Disaster
            <span className="text-blue-600">
              Safe
            </span>
          </Link>


          <Link
            to="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">


        {/* =================================================
            HEADING
        ================================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Disaster Information
          </p>


          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Stay informed about disasters
          </h1>


          <p className="mt-2 max-w-2xl text-gray-600">
            Monitor current weather, retrieve your
            location, and check official government
            disaster alerts.
          </p>

        </div>


        {/* =================================================
            CURRENT LOCATION
        ================================================== */}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Your Location
              </p>


              <h2 className="mt-2 text-xl font-bold text-gray-900">

                {location
                  ? 'Current location detected 📍'
                  : 'Location not detected'}

              </h2>


              {location ? (

                <div className="mt-2 space-y-1 text-sm text-gray-600">

                  <p>
                    Latitude:{' '}
                    <strong>
                      {location.latitude.toFixed(6)}
                    </strong>
                  </p>


                  <p>
                    Longitude:{' '}
                    <strong>
                      {location.longitude.toFixed(6)}
                    </strong>
                  </p>


                  <p>
                    Accuracy: approximately{' '}
                    <strong>
                      {Math.round(
                        location.accuracy,
                      )}{' '}
                      metres
                    </strong>
                  </p>


                  {resolvedLocation.city && (

                    <p>
                      City:{' '}
                      <strong>
                        {resolvedLocation.city}
                      </strong>
                    </p>

                  )}


                  {resolvedLocation.district && (

                    <p>
                      District:{' '}
                      <strong>
                        {resolvedLocation.district}
                      </strong>
                    </p>

                  )}


                  {resolvedLocation.state && (

                    <p>
                      State:{' '}
                      <strong>
                        {resolvedLocation.state}
                      </strong>
                    </p>

                  )}

                </div>

              ) : (

                <p className="mt-2 text-sm text-gray-500">
                  Allow location access to receive
                  location-based disaster information.
                </p>

              )}

            </div>


            <button
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {locationLoading
                ? 'Getting location...'
                : '📍 Use My Current Location'}

            </button>

          </div>


          {locationError && (

            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {locationError}
            </div>

          )}


          {location && (

            <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">

              ✓ Current GPS coordinates retrieved
              successfully.

              {resolvedLocation.district && (

                <>
                  {' '}
                  Detected district:{' '}

                  <strong>
                    {resolvedLocation.district}
                  </strong>.
                </>

              )}

            </div>

          )}

        </div>


        {/* =================================================
            OFFICIAL GOVERNMENT ALERTS
        ================================================== */}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                Official Government Alerts
              </p>


              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                SACHET / NDMA
              </h2>

            </div>


            <div className="flex items-center gap-3">

              <button
                onClick={enableNotifications}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {notificationsEnabled
                  ? '🔔 Notifications Enabled'
                  : '🔔 Enable Alert Notifications'}
              </button>

              <div className="text-4xl">
                🚨
              </div>

            </div>

          </div>


          {lastAlertCheck && (

            <p className="mt-3 text-xs text-gray-500">
              🔄 Auto-checking every 60 seconds.
              Last checked:{' '}
              {lastAlertCheck.toLocaleTimeString()}
            </p>

          )}


          {alertLoading && (

            <p className="mt-5 text-sm text-gray-600">
              Checking current official alerts...
            </p>

          )}


          {alertError && (

            <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {alertError}
            </div>

          )}


          {officialAlerts &&
            officialAlerts.alert_count === 0 &&
            !alertLoading && (

              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">

                <p className="font-bold text-green-700">
                  🟢 No location-matched official
                  disaster alerts found.
                </p>


                <p className="mt-2 text-sm text-green-700">
                  Location checked:{' '}

                  {officialAlerts.district ||
                    'Detected location'}

                  {officialAlerts.state
                    ? `, ${officialAlerts.state}`
                    : ''}
                </p>

              </div>

            )}


          {officialAlerts &&
            officialAlerts.alert_count > 0 && (

              <div className="mt-5 space-y-4">

                {officialAlerts.alerts.map(
                  (alert, index) => (

                    <div
                      key={
                        String(
                          alert.identifier ||
                            `${alert.event}-${index}`,
                        )
                      }
                      className={`rounded-xl border p-5 ${getAlertStyle(
                        alert.severity,
                      )}`}
                    >

                      <div className="flex items-start gap-4">

                        <div className="text-3xl">
                          🚨
                        </div>


                        <div className="flex-1">

                          <h3 className="text-lg font-bold text-gray-900">

                            {alert.headline ||
                              alert.event ||
                              'Official Disaster Alert'}

                          </h3>


                          {alert.description && (

                            <p className="mt-2 text-sm text-gray-700">
                              {alert.description}
                            </p>

                          )}


                          <div className="mt-3 flex flex-wrap gap-2 text-xs">

                            {alert.severity && (

                              <span className="rounded-full bg-white px-3 py-1 font-semibold">
                                Severity:{' '}
                                {alert.severity}
                              </span>

                            )}


                            {alert.urgency && (

                              <span className="rounded-full bg-white px-3 py-1 font-semibold">
                                Urgency:{' '}
                                {alert.urgency}
                              </span>

                            )}


                            {alert.certainty && (

                              <span className="rounded-full bg-white px-3 py-1 font-semibold">
                                Certainty:{' '}
                                {alert.certainty}
                              </span>

                            )}

                          </div>


                          {alert.area && (

                            <p className="mt-3 text-xs text-gray-600">
                              Area:{' '}
                              {alert.area}
                            </p>

                          )}


                          {alert.alert_source && (

                            <p className="mt-2 text-xs text-gray-600">
                              Issued by:{' '}
                              <strong>
                                {alert.alert_source}
                              </strong>
                            </p>

                          )}


                          {alert.effective_start_time && (

                            <p className="mt-1 text-xs text-gray-500">
                              Valid from:{' '}
                              {alert.effective_start_time}
                            </p>

                          )}


                          {alert.effective_end_time && (

                            <p className="mt-1 text-xs text-gray-500">
                              Valid until:{' '}
                              {alert.effective_end_time}
                            </p>

                          )}

                        </div>

                      </div>

                    </div>

                  ),
                )}

              </div>

            )}


          {!officialAlerts &&
            !alertLoading &&
            !alertError && (

              <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">

                Click{' '}
                <strong>
                  "Use My Current Location"
                </strong>{' '}
                to check official government alerts
                for your location.

              </div>

            )}


          <p className="mt-5 text-xs text-gray-500">
            Source: SACHET / National Disaster
            Management Authority. Government alerts
            are displayed separately from weather-based
            risk estimates.
          </p>

        </div>


        {/* =================================================
            CURRENT WEATHER
        ================================================== */}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Current Weather
              </p>


              <h2 className="mt-2 text-2xl font-bold text-gray-900">

                {loading
                  ? 'Loading...'
                  : weather?.city ||
                    'Location unavailable'}

              </h2>

            </div>


            <div className="text-4xl">
              🌤️
            </div>

          </div>


          {weather && (

            <>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Temperature
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {weather.temperature}°C
                  </p>

                </div>


                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Feels Like
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {weather.feels_like}°C
                  </p>

                </div>


                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Humidity
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {weather.humidity}%
                  </p>

                </div>


                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Wind
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {weather.wind_speed} km/h
                  </p>

                </div>

              </div>


              <p className="mt-4 text-sm text-gray-600">

                Condition:{' '}

                <strong>
                  {weather.description}
                </strong>

              </p>

            </>

          )}

        </div>


        {/* =================================================
            WEATHER RISK
        ================================================== */}

        <div
          className={`mb-8 rounded-2xl border p-6 ${getSeverityStyle()}`}
        >

          <div className="flex items-start gap-4">

            <div className="text-3xl">

              {weather?.severity === 'high'
                ? '🚨'
                : '⚠️'}

            </div>


            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Weather Risk Information
              </h2>


              {loading ? (

                <p className="mt-2 text-sm text-gray-600">
                  Checking current conditions...
                </p>

              ) : (

                <p className="mt-2 text-sm text-gray-700">

                  {weather?.alert ||
                    'No significant weather-related risk detected.'}

                </p>

              )}


              <p className="mt-3 text-xs text-gray-500">
                ⚠️ This is weather-based preparedness
                information, not an official emergency
                warning. Always follow warnings issued
                by authorized government agencies.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            DISASTER TYPES
        ================================================== */}

        <h2 className="mb-5 text-2xl font-bold text-gray-900">
          Disaster Safety Information
        </h2>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {disasters.map(
            (disaster) => (

              <div
                key={disaster.title}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="text-4xl">
                  {disaster.icon}
                </div>


                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {disaster.title}
                </h2>


                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {disaster.description}
                </p>


                <button
                  className="mt-5 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  View Details
                </button>

              </div>

            ),
          )}

        </div>

      </main>

    </div>
  )
}


export default DisastersPage