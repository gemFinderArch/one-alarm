import { setAlarm, dismissAlarm } from 'expo-alarm';
import { ALARM_MESSAGE } from './constants';

/**
 * Schedule a native alarm for the Brahma Muhurta time.
 * Uses Android's AlarmClock ACTION_SET_ALARM intent via expo-alarm.
 * The system alarm clock handles: screen wake, sound, vibration, dismiss UI.
 */
export async function scheduleBrahmaMuhurtaAlarm(alarmTime: Date): Promise<void> {
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
 * Attempt to cancel the Brahma Muhurta alarm.
 * Note: dismissAlarm sends ACTION_DISMISS_ALARM which dismisses a currently-ringing
 * alarm. To truly "cancel" a future alarm, we re-set it with setAlarm which replaces
 * the previous one - the system alarm app deduplicates by hour/minute/message.
 * When disabling, we call this as a best-effort dismissal.
 */
export async function cancelBrahmaMuhurtaAlarm(): Promise<void> {
  try {
    await dismissAlarm({ searchMode: 'android.label', extra: { 'android.intent.extra.alarm.MESSAGE': ALARM_MESSAGE } });
  } catch {
    // Best-effort: dismissAlarm may not cancel a future alarm on all devices
  }
}
