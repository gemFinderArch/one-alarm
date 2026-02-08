import { Platform } from 'react-native';
import { BACKGROUND_ALARM_TASK } from '../lib/constants';
import { getLocation, getAutoUpdate, saveLastSynced } from '../lib/storage';
import { getNextAlarmTimes } from '../lib/sunrise';
import { scheduleBrahmaMuhurtaAlarm, schedulePrepareForSleepAlarm } from '../lib/alarm-scheduler';
import { scheduleSleepReminder, cancelSleepReminder } from '../lib/sleep-notifier';

/**
 * Recalculate alarm times and reschedule both alarms.
 * Used both by background fetch and foreground recalculation.
 * Only runs if autoUpdate is enabled.
 */
export async function recalculateAndSchedule(): Promise<void> {
  const location = await getLocation();
  const autoUpdate = await getAutoUpdate();

  if (!location || !autoUpdate) return;

  const times = getNextAlarmTimes(location.latitude, location.longitude);
  if (!times) return;

  await scheduleBrahmaMuhurtaAlarm(times.brahmaMuhurta);
  await schedulePrepareForSleepAlarm(times.prepareForSleepTime);
  await cancelSleepReminder();
  await scheduleSleepReminder(times.prepareForSleepTime);
  await saveLastSynced(new Date());
}

// Register native background task only on mobile platforms
if (Platform.OS !== 'web') {
  const TaskManager = require('expo-task-manager');
  const BackgroundFetch = require('expo-background-fetch');

  TaskManager.defineTask(BACKGROUND_ALARM_TASK, async () => {
    try {
      await recalculateAndSchedule();
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
}

/**
 * Register the background fetch task to run every 12 hours. No-op on web.
 */
export async function registerBackgroundAlarmTask(): Promise<void> {
  if (Platform.OS === 'web') return;

  const TaskManager = require('expo-task-manager');
  const BackgroundFetch = require('expo-background-fetch');

  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_ALARM_TASK);
  if (isRegistered) return;

  await BackgroundFetch.registerTaskAsync(BACKGROUND_ALARM_TASK, {
    minimumInterval: 12 * 60 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

/**
 * Unregister the background fetch task. No-op on web.
 */
export async function unregisterBackgroundAlarmTask(): Promise<void> {
  if (Platform.OS === 'web') return;

  const TaskManager = require('expo-task-manager');

  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_ALARM_TASK);
  if (!isRegistered) return;

  await TaskManager.unregisterTaskAsync(BACKGROUND_ALARM_TASK);
}
