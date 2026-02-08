import { Platform } from 'react-native';
import { LocationData } from '../types';

/**
 * Request foreground location permission from the user.
 * Returns true if permission was granted, false otherwise.
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const Location = await import('expo-location');
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

/**
 * Get the device's current location via GPS.
 * Returns null on web.
 */
export async function getCurrentLocation(): Promise<LocationData | null> {
  if (Platform.OS === 'web') return null;

  try {
    const Location = await import('expo-location');
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
