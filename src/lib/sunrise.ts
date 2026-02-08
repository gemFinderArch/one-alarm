import {
  BRAHMA_MUHURTA_OFFSET_MINUTES,
  GODHULI_KAAL_HOURS,
  GODHULI_KAAL_REMINDER_MINUTES,
  PRADOSHA_KAAL_HOURS,
  PRADOSHA_KAAL_REMINDER_HOURS,
} from './constants';
import type { AlarmTimes } from '../types';

/**
 * NOAA Solar Calculator algorithm for precise sunrise times.
 * Matches timeanddate.com to within ~1 minute.
 * Based on: https://gml.noaa.gov/grad/solcalc/
 */

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

function toDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

/** Convert a calendar date to Julian Day Number. */
function getJulianDay(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}

/** Compute solar parameters for a given Julian Century T. */
function solarParams(T: number) {
  // Geometric Mean Longitude of Sun (degrees)
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;

  // Geometric Mean Anomaly of Sun (degrees)
  const M = 357.52911 + T * (35999.05029 - T * 0.0001537);

  // Eccentricity of Earth's Orbit
  const e = 0.016708634 - T * (0.000042037 + T * 0.0000001267);

  // Sun's Equation of Center
  const Mrad = toRad(M);
  const C =
    (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(Mrad) +
    (0.019993 - T * 0.000101) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  // Sun's True and Apparent Longitude
  const sunTrueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const sunApparentLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(toRad(omega));

  // Obliquity of Ecliptic (corrected)
  const meanObliq =
    23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const obliqCorr = meanObliq + 0.00256 * Math.cos(toRad(omega));

  // Sun's Declination
  const dec = Math.asin(Math.sin(toRad(obliqCorr)) * Math.sin(toRad(sunApparentLong)));

  // Equation of Time (minutes)
  const y = Math.tan(toRad(obliqCorr) / 2) ** 2;
  const L0rad = toRad(L0);
  const eqTime =
    4 *
    toDeg(
      y * Math.sin(2 * L0rad) -
        2 * e * Math.sin(Mrad) +
        4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0rad) -
        0.5 * y * y * Math.sin(4 * L0rad) -
        1.25 * e * e * Math.sin(2 * Mrad),
    );

  return { dec, eqTime };
}

/**
 * Calculate sunrise time in minutes from midnight UTC using the NOAA algorithm.
 * Uses two-pass refinement: compute solar params at approximate sunrise time
 * for higher accuracy.
 * Returns null for polar latitudes with no sunrise.
 */
function calcSunriseUTC(JD: number, lat: number, lng: number): number | null {
  const zenith = 90.833; // Official sunrise: 90°50' (refraction + sun radius)
  const latRad = toRad(lat);

  // First pass: compute at noon
  const T0 = (JD - 2451545.0) / 36525.0;
  const { dec: dec0, eqTime: eqTime0 } = solarParams(T0);

  let cosHA = (Math.cos(toRad(zenith)) / (Math.cos(latRad) * Math.cos(dec0))) - Math.tan(latRad) * Math.tan(dec0);
  if (cosHA > 1 || cosHA < -1) return null;

  const HA0 = toDeg(Math.acos(cosHA));
  const sunrise0 = 720 - 4 * (lng + HA0) - eqTime0;

  // Second pass: recompute at the approximate sunrise time for better precision
  const JDsunrise = JD + sunrise0 / 1440.0;
  const T1 = (JDsunrise - 2451545.0) / 36525.0;
  const { dec: dec1, eqTime: eqTime1 } = solarParams(T1);

  cosHA = (Math.cos(toRad(zenith)) / (Math.cos(latRad) * Math.cos(dec1))) - Math.tan(latRad) * Math.tan(dec1);
  if (cosHA > 1 || cosHA < -1) return null;

  const HA1 = toDeg(Math.acos(cosHA));
  return 720 - 4 * (lng + HA1) - eqTime1;
}

/**
 * Calculate sunset time in minutes from midnight UTC using the NOAA algorithm.
 * Mirror of calcSunriseUTC but using (lng - HA) for sunset.
 * Returns null for polar latitudes with no sunset.
 */
function calcSunsetUTC(JD: number, lat: number, lng: number): number | null {
  const zenith = 90.833;
  const latRad = toRad(lat);

  // First pass: compute at noon
  const T0 = (JD - 2451545.0) / 36525.0;
  const { dec: dec0, eqTime: eqTime0 } = solarParams(T0);

  let cosHA = (Math.cos(toRad(zenith)) / (Math.cos(latRad) * Math.cos(dec0))) - Math.tan(latRad) * Math.tan(dec0);
  if (cosHA > 1 || cosHA < -1) return null;

  const HA0 = toDeg(Math.acos(cosHA));
  const sunset0 = 720 - 4 * (lng - HA0) - eqTime0;

  // Second pass: recompute at the approximate sunset time for better precision
  const JDsunset = JD + sunset0 / 1440.0;
  const T1 = (JDsunset - 2451545.0) / 36525.0;
  const { dec: dec1, eqTime: eqTime1 } = solarParams(T1);

  cosHA = (Math.cos(toRad(zenith)) / (Math.cos(latRad) * Math.cos(dec1))) - Math.tan(latRad) * Math.tan(dec1);
  if (cosHA > 1 || cosHA < -1) return null;

  const HA1 = toDeg(Math.acos(cosHA));
  return 720 - 4 * (lng - HA1) - eqTime1;
}

/**
 * Get the sunrise time for a given date and location.
 * Uses the NOAA Solar Calculator algorithm for high precision.
 * Returns null if sunrise doesn't occur (polar latitudes).
 */
export function getSunrise(date: Date, lat: number, lng: number): Date | null {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const JD = getJulianDay(year, month, day);

  const sunriseUTC = calcSunriseUTC(JD, lat, lng);
  if (sunriseUTC === null) return null;

  // Convert UTC minutes to a Date object
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  const totalMs = sunriseUTC * 60 * 1000;
  result.setTime(result.getTime() + totalMs);

  return result;
}

/**
 * Get the sunset time for a given date and location.
 * Uses the NOAA Solar Calculator algorithm for high precision.
 * Returns null if sunset doesn't occur (polar latitudes).
 */
export function getSunset(date: Date, lat: number, lng: number): Date | null {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const JD = getJulianDay(year, month, day);

  const sunsetUTC = calcSunsetUTC(JD, lat, lng);
  if (sunsetUTC === null) return null;

  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  const totalMs = sunsetUTC * 60 * 1000;
  result.setTime(result.getTime() + totalMs);

  return result;
}

/**
 * Get the Brahma Muhurta time (96 minutes before sunrise).
 */
export function getBrahmaMuhurta(sunrise: Date): Date {
  return new Date(sunrise.getTime() - BRAHMA_MUHURTA_OFFSET_MINUTES * 60 * 1000);
}

/**
 * Get the next relevant alarm times.
 *
 * The entire daily cycle pivots on Brahma Muhurta:
 * - Once today's BM passes, EVERYTHING flips to tomorrow's sunrise.
 * - Press Sync at wake-up → all alarms set for the next cycle.
 * - No need to touch the phone again until tomorrow's BM rings.
 */
export function getNextAlarmTimes(lat: number, lng: number): AlarmTimes | null {
  const now = new Date();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if today's BM has passed — that's the flip trigger
  const todaySunrise = getSunrise(today, lat, lng);
  const todayBM = todaySunrise ? getBrahmaMuhurta(todaySunrise) : null;
  const bmPassed = !todayBM || todayBM <= now;

  // Once BM passes, entire cycle flips to tomorrow
  const targetDay = bmPassed ? tomorrow : today;
  const sunrise = bmPassed ? getSunrise(tomorrow, lat, lng) : todaySunrise;
  if (!sunrise) return null;

  const sunset = getSunset(targetDay, lat, lng);
  if (!sunset) return null;

  const brahmaMuhurta = getBrahmaMuhurta(sunrise);

  const godhuliKaalTime = new Date(brahmaMuhurta.getTime() - GODHULI_KAAL_HOURS * 60 * 60 * 1000);
  const godhuliKaalReminderTime = new Date(godhuliKaalTime.getTime() - GODHULI_KAAL_REMINDER_MINUTES * 60 * 1000);
  const pradoshaKaalTime = new Date(brahmaMuhurta.getTime() - PRADOSHA_KAAL_HOURS * 60 * 60 * 1000);
  const pradoshaKaalReminderTime = new Date(brahmaMuhurta.getTime() - PRADOSHA_KAAL_REMINDER_HOURS * 60 * 60 * 1000);

  return {
    sunrise,
    sunset,
    brahmaMuhurta,
    godhuliKaalReminderTime,
    godhuliKaalTime,
    pradoshaKaalReminderTime,
    pradoshaKaalTime,
  };
}
