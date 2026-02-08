import * as Location from 'expo-location';
import { LocationData } from '../types';

/**
 * Request foreground location permission from the user.
 * Returns true if permission was granted, false otherwise.
 */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

/**
 * Get the device's current location via GPS.
 * Requests permission, obtains coordinates at city-level accuracy,
 * and reverse geocodes to determine the city name.
 * Returns null if permission is denied or an error occurs.
 */
export async function getCurrentLocation(): Promise<LocationData | null> {
  try {
    const granted = await requestLocationPermission();
    if (!granted) return null;

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    const { latitude, longitude } = position.coords;

    let city = 'Unknown';
    try {
      const [geocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode) {
        city = geocode.city ?? geocode.subregion ?? geocode.region ?? 'Unknown';
      }
    } catch {
      // Reverse geocoding can fail on some devices; fall back to "Unknown"
    }

    return { latitude, longitude, city };
  } catch {
    return null;
  }
}
