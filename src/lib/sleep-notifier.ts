import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Set up the notification channel for sleep reminders (Android only).
 */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('sleep-reminder', {
      name: 'Sleep Reminder',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

/**
 * Schedule a notification reminding the user to go to sleep.
 * Returns the notification identifier for later cancellation.
 */
export async function scheduleSleepReminder(sleepTime: Date): Promise<string> {
  const wakeTime = new Date(sleepTime.getTime() + 9 * 60 * 60 * 1000);
  const wakeTimeFormatted = wakeTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to Wind Down',
      body: `Start winding down for bed. Wake time: ${wakeTimeFormatted}`,
      sound: 'default',
      ...(Platform.OS === 'android' && { channelId: 'sleep-reminder' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: sleepTime,
    },
  });

  return identifier;
}

/**
 * Cancel all scheduled sleep reminder notifications.
 */
export async function cancelSleepReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
