import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_ALARM_TASK } from '../lib/constants';
import { getLocation, getAlarmEnabled } from '../lib/storage';
import { getAlarmTimes } from '../lib/sunrise';
import { scheduleBrahmaMuhurtaAlarm } from '../lib/alarm-scheduler';
import { scheduleSleepReminder, cancelSleepReminder } from '../lib/sleep-notifier';

/**
 * Recalculate alarm times and reschedule.
 * Used both by background fetch and foreground recalculation.
 */
export async function recalculateAndSchedule(): Promise<void> {
  const location = await getLocation();
  const enabled = await getAlarmEnabled();

  if (!location || !enabled) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const times = getAlarmTimes(tomorrow, location.latitude, location.longitude);

  await scheduleBrahmaMuhurtaAlarm(times.brahmaMuhurta);
  await cancelSleepReminder();
  await scheduleSleepReminder(times.sleepTime);
}

/**
 * Define the background task for alarm recalculation.
 * Must be called at module level (outside any component).
 */
TaskManager.defineTask(BACKGROUND_ALARM_TASK, async () => {
  try {
    await recalculateAndSchedule();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Register the background fetch task to run every 12 hours.
 */
export async function registerBackgroundAlarmTask(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_ALARM_TASK);
  if (isRegistered) return;

  await BackgroundFetch.registerTaskAsync(BACKGROUND_ALARM_TASK, {
    minimumInterval: 12 * 60 * 60, // 12 hours in seconds
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
