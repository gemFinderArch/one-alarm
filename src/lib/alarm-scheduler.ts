import { Platform } from 'react-native';
import { ALARM_MESSAGE, PREPARE_FOR_SLEEP_MESSAGE } from './constants';

/**
 * Schedule a native alarm for the Brahma Muhurta time.
 * Uses Android's AlarmClock ACTION_SET_ALARM intent via expo-alarm.
 * No-op on web.
 */
export async function scheduleBrahmaMuhurtaAlarm(alarmTime: Date): Promise<void> {
  if (Platform.OS === 'web') return;

  const { setAlarm } = await import('expo-alarm');
  const hour = alarmTime.getHours();
  const minutes = alarmTime.getMinutes();

  await setAlarm({
    hour,
    minutes,
    message: ALARM_MESSAGE,
    vibrate: true,
    skipUi: true,
  });
}

/**
 * Attempt to cancel the Brahma Muhurta alarm. No-op on web.
 */
export async function cancelBrahmaMuhurtaAlarm(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const { dismissAlarm } = await import('expo-alarm');
    await dismissAlarm({ searchMode: 'android.label', extra: { 'android.intent.extra.alarm.MESSAGE': ALARM_MESSAGE } });
  } catch {
    // Best-effort: dismissAlarm may not cancel a future alarm on all devices
  }
}

/**
 * Schedule a native alarm for the Prepare for Sleep time.
 * Uses Android's AlarmClock ACTION_SET_ALARM intent via expo-alarm.
 * No-op on web.
 */
export async function schedulePrepareForSleepAlarm(alarmTime: Date): Promise<void> {
  if (Platform.OS === 'web') return;

  const { setAlarm } = await import('expo-alarm');
  const hour = alarmTime.getHours();
  const minutes = alarmTime.getMinutes();

  await setAlarm({
    hour,
    minutes,
    message: PREPARE_FOR_SLEEP_MESSAGE,
    vibrate: true,
    skipUi: true,
  });
}

/**
 * Attempt to cancel the Prepare for Sleep alarm. No-op on web.
 */
export async function cancelPrepareForSleepAlarm(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const { dismissAlarm } = await import('expo-alarm');
    await dismissAlarm({ searchMode: 'android.label', extra: { 'android.intent.extra.alarm.MESSAGE': PREPARE_FOR_SLEEP_MESSAGE } });
  } catch {
    // Best-effort: dismissAlarm may not cancel a future alarm on all devices
  }
}
