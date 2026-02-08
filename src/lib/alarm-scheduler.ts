import { Platform } from 'react-native';
import { ALARM_MESSAGE, PREPARE_FOR_SLEEP_MESSAGE } from './constants';

/**
 * expo-alarm wraps Android AlarmClock intents.
 *
 * 1. setAlarm uses startActivityForResult — the returned promise often
 *    never resolves when skipUi is true.  We fire-and-forget.
 *
 * 2. Android can only process one AlarmClock intent at a time.  Two
 *    dispatched back-to-back → second silently dropped.  We sequence
 *    with a 700 ms gap.
 *
 * RULE: Native alarms are ONLY set via syncBothAlarms (Sync button)
 *       or scheduleBothAlarmsSilent (background task).  Nothing else.
 */

const INTENT_GAP_MS = 700;

function fire(fn: () => Promise<unknown>): void {
  fn().catch(() => {});
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Set both native alarms silently.  No-op on web.
 * Used by both manual Sync and background task.
 */
export async function syncBothAlarms(bmTime: Date, pkTime: Date): Promise<void> {
  if (Platform.OS === 'web') return;

  const { setAlarm } = await import('expo-alarm');

  fire(() =>
    setAlarm({
      hour: bmTime.getHours(),
      minutes: bmTime.getMinutes(),
      message: ALARM_MESSAGE,
      vibrate: true,
      skipUi: true,
    }),
  );

  await wait(INTENT_GAP_MS);

  fire(() =>
    setAlarm({
      hour: pkTime.getHours(),
      minutes: pkTime.getMinutes(),
      message: PREPARE_FOR_SLEEP_MESSAGE,
      vibrate: true,
      skipUi: true,
    }),
  );
}
