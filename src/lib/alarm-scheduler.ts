import { setAlarm, dismissAlarm } from 'expo-alarm';
import { ALARM_MESSAGE } from '../lib/constants';

/**
 * Schedule a native alarm for the Brahma Muhurta time.
 * Uses expo-alarm's setAlarm to set the device alarm clock.
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
 * Cancel the Brahma Muhurta alarm by dismissing the current alarm.
 */
export async function cancelBrahmaMuhurtaAlarm(): Promise<void> {
  await dismissAlarm();
}
