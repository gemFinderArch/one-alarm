import SunCalc from 'suncalc';
import { BRAHMA_MUHURTA_OFFSET_MINUTES, SLEEP_BEFORE_ALARM_HOURS } from './constants';
import type { AlarmTimes } from '../types';

/**
 * Get the sunrise time for a given date and location.
 * Returns null if sunrise doesn't occur (polar latitudes).
 */
export function getSunrise(date: Date, lat: number, lng: number): Date | null {
  const times = SunCalc.getTimes(date, lat, lng);
  if (isNaN(times.sunrise.getTime())) {
    return null;
  }
  return times.sunrise;
}

/**
 * Get the Brahma Muhurta time (96 minutes before sunrise).
 */
export function getBrahmaMuhurta(sunrise: Date): Date {
  return new Date(sunrise.getTime() - BRAHMA_MUHURTA_OFFSET_MINUTES * 60 * 1000);
}

/**
 * Get the recommended sleep time (9 hours before the Brahma Muhurta alarm).
 */
export function getSleepTime(brahmaMuhurtaTime: Date): Date {
  return new Date(brahmaMuhurtaTime.getTime() - SLEEP_BEFORE_ALARM_HOURS * 60 * 60 * 1000);
}

/**
 * Calculate all alarm-related times for a given date and location.
 * Returns null if sunrise doesn't occur at this latitude/date.
 */
export function getAlarmTimes(date: Date, lat: number, lng: number): AlarmTimes | null {
  const sunrise = getSunrise(date, lat, lng);
  if (!sunrise) return null;

  const brahmaMuhurta = getBrahmaMuhurta(sunrise);
  const sleepTime = getSleepTime(brahmaMuhurta);

  return { sunrise, brahmaMuhurta, sleepTime };
}

/**
 * Get the next relevant alarm times.
 * If today's Brahma Muhurta hasn't passed, use today.
 * Otherwise use tomorrow.
 */
export function getNextAlarmTimes(lat: number, lng: number): AlarmTimes | null {
  const now = new Date();

  // Try today first
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayTimes = getAlarmTimes(today, lat, lng);

  if (todayTimes && todayTimes.brahmaMuhurta > now) {
    return todayTimes;
  }

  // Today's Brahma Muhurta has passed (or no sunrise today), use tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return getAlarmTimes(tomorrow, lat, lng);
}
