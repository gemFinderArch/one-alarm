import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SLEEP_BEFORE_ALARM_HOURS } from './constants';

let sleepNotificationId: string | null = null;

/**
 * Set up the notification channel for sleep reminders (Android only).
 * Also requests notification permissions.
 */
export async function setupNotificationChannel(): Promise<void> {
  await Notifications.requestPermissionsAsync();

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
 * Skips scheduling if sleepTime is in the past.
 */
export async function scheduleSleepReminder(sleepTime: Date): Promise<string | null> {
  // Don't schedule notifications for past times
  if (sleepTime.getTime() <= Date.now()) {
    return null;
  }

  // Cancel any existing sleep reminder first
  await cancelSleepReminder();

  const wakeTime = new Date(sleepTime.getTime() + SLEEP_BEFORE_ALARM_HOURS * 60 * 60 * 1000);
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

  sleepNotificationId = identifier;
  return identifier;
}

/**
 * Cancel the scheduled sleep reminder notification.
 */
export async function cancelSleepReminder(): Promise<void> {
  if (sleepNotificationId) {
    await Notifications.cancelScheduledNotificationAsync(sleepNotificationId);
    sleepNotificationId = null;
  }
}
