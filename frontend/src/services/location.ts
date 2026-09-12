export type UserLocation = {
  latitude: number
  longitude: number
  accuracy: number
}

export function getCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error('Geolocation is not supported by this browser.'),
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                'Location permission was denied. Please allow location access.',
              ),
            )
            break

          case error.POSITION_UNAVAILABLE:
            reject(
              new Error(
                'Your current location could not be determined.',
              ),
            )
            break

          case error.TIMEOUT:
            reject(
              new Error(
                'Location request timed out. Please try again.',
              ),
            )
            break

          default:
            reject(
              new Error('Unable to retrieve your location.'),
            )
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 15000,
      },
    )
  })
}