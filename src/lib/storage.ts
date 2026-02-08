import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../types';
import type { LocationData } from '../types';

/**
 * Save the user's location to persistent storage.
 */
export async function saveLocation(location: LocationData): Promise<void> {
  await AsyncStorage.setItem(StorageKeys.LOCATION, JSON.stringify(location));
}

/**
 * Retrieve the user's saved location from persistent storage.
 * Returns null if no location has been saved.
 */
export async function getLocation(): Promise<LocationData | null> {
  const raw = await AsyncStorage.getItem(StorageKeys.LOCATION);
  if (raw === null) {
    return null;
  }
  return JSON.parse(raw) as LocationData;
}

/**
 * Save the alarm enabled/disabled state to persistent storage.
 */
export async function saveAlarmEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(StorageKeys.ALARM_ENABLED, JSON.stringify(enabled));
}

/**
 * Retrieve the alarm enabled/disabled state from persistent storage.
 * Defaults to false if no value has been saved.
 */
export async function getAlarmEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(StorageKeys.ALARM_ENABLED);
  if (raw === null) {
    return false;
  }
  return JSON.parse(raw) as boolean;
}

/**
 * Save the auto-update preference to persistent storage.
 */
export async function saveAutoUpdate(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(StorageKeys.AUTO_UPDATE, JSON.stringify(enabled));
}

/**
 * Retrieve the auto-update preference from persistent storage.
 * Defaults to false if no value has been saved.
 */
export async function getAutoUpdate(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(StorageKeys.AUTO_UPDATE);
  if (raw === null) {
    return false;
  }
  return JSON.parse(raw) as boolean;
}

/**
 * Save the last-synced timestamp to persistent storage.
 */
export async function saveLastSynced(date: Date): Promise<void> {
  await AsyncStorage.setItem(StorageKeys.LAST_SYNCED, date.toISOString());
}

/**
 * Retrieve the last-synced timestamp from persistent storage.
 * Returns null if never synced.
 */
export async function getLastSynced(): Promise<Date | null> {
  const raw = await AsyncStorage.getItem(StorageKeys.LAST_SYNCED);
  if (raw === null) {
    return null;
  }
  return new Date(raw);
}
