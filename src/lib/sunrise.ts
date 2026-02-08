import SunCalc from 'suncalc';
import { BRAHMA_MUHURTA_OFFSET_MINUTES, SLEEP_BEFORE_ALARM_HOURS } from '../lib/constants';
import type { AlarmTimes } from '../types';

/**
 * Get the sunrise time for a given date and location.
 */
export function getSunrise(date: Date, lat: number, lng: number): Date {
  const times = SunCalc.getTimes(date, lat, lng);
  return times.sunrise;
}

/**
 * Get the Brahma Muhurta time (96 minutes before sunrise).
 */
export function getBrahmaMuhurta(date: Date, lat: number, lng: number): Date {
  const sunrise = getSunrise(date, lat, lng);
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
 */
export function getAlarmTimes(date: Date, lat: number, lng: number): AlarmTimes {
  const sunrise = getSunrise(date, lat, lng);
  const brahmaMuhurta = getBrahmaMuhurta(date, lat, lng);
  const sleepTime = getSleepTime(brahmaMuhurta);

  return {
    sunrise,
    brahmaMuhurta,
    sleepTime,
  };
}
