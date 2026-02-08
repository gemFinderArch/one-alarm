import { Platform } from 'react-native';

/**
 * Set up the notification channel and request permissions (Android only).
 * No-op on web.
 */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = await import('expo-notifications');
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
