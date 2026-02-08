import { Platform } from 'react-native';
import { BACKGROUND_ALARM_TASK } from '../lib/constants';
import { getLocation, getAutoUpdate, saveLastSynced } from '../lib/storage';
import { getNextAlarmTimes } from '../lib/sunrise';
import { syncAllAlarms } from '../lib/alarm-scheduler';

/**
 * Recalculate alarm times and reschedule all five native alarms silently.
 * Only runs if autoUpdate is enabled.
 */
export async function recalculateAndSchedule(): Promise<void> {
  const [location, autoUpdate] = await Promise.all([getLocation(), getAutoUpdate()]);
  if (!location || !autoUpdate) return;

  const times = getNextAlarmTimes(location.latitude, location.longitude);
  if (!times) return;

  await syncAllAlarms(
    times.brahmaMuhurta,
    times.godhuliKaalReminderTime,
    times.godhuliKaalTime,
    times.pradoshaKaalReminderTime,
    times.pradoshaKaalTime,
  );
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

export async function unregisterBackgroundAlarmTask(): Promise<void> {
  if (Platform.OS === 'web') return;

  const TaskManager = require('expo-task-manager');

  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_ALARM_TASK);
  if (!isRegistered) return;

  await TaskManager.unregisterTaskAsync(BACKGROUND_ALARM_TASK);
}
