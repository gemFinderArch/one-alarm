import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import type { LocationData, AlarmTimes } from '../types';
import { getNextAlarmTimes } from '../lib/sunrise';
import { saveAutoUpdate, getAutoUpdate, saveLastSynced, getLastSynced } from '../lib/storage';
import {
  scheduleBrahmaMuhurtaAlarm,
  cancelBrahmaMuhurtaAlarm,
  schedulePrepareForSleepAlarm,
  cancelPrepareForSleepAlarm,
} from '../lib/alarm-scheduler';
import { scheduleSleepReminder, cancelSleepReminder } from '../lib/sleep-notifier';
import { registerBackgroundAlarmTask, unregisterBackgroundAlarmTask } from '../tasks/recalculate-alarm';

export function useAlarmState(location: LocationData | null) {
  const [alarmTimes, setAlarmTimes] = useState<AlarmTimes | null>(null);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Load auto-update and last-synced from storage on mount
  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      try {
        const [savedAutoUpdate, savedLastSynced] = await Promise.all([
          getAutoUpdate(),
          getLastSynced(),
        ]);
        if (!cancelled) {
          setAutoUpdate(savedAutoUpdate);
          setLastSynced(savedLastSynced);
        }
      } catch {
        // Defaults are fine
      }
    }

    loadState();

    return () => {
      cancelled = true;
    };
  }, []);

  // Calculate alarm times when location changes
  useEffect(() => {
    if (!location) {
      setAlarmTimes(null);
      return;
    }

    const times = getNextAlarmTimes(location.latitude, location.longitude);
    setAlarmTimes(times);
  }, [location?.latitude, location?.longitude]);

  // Recalculate displayed times on app foreground.
  // If autoUpdate is ON, also re-sync alarms.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active' && location) {
        const times = getNextAlarmTimes(location.latitude, location.longitude);
        setAlarmTimes(times);

        if (autoUpdate && times) {
          try {
            await scheduleBrahmaMuhurtaAlarm(times.brahmaMuhurta);
            await schedulePrepareForSleepAlarm(times.prepareForSleepTime);
            await cancelSleepReminder();
            await scheduleSleepReminder(times.prepareForSleepTime);
            const now = new Date();
            await saveLastSynced(now);
            setLastSynced(now);
          } catch {
            // Best-effort foreground sync
          }
        }
      }
    });

    return () => subscription.remove();
  }, [location?.latitude, location?.longitude, autoUpdate]);

  const syncAlarms = useCallback(async () => {
    if (!alarmTimes || syncing) return;

    setSyncing(true);
    try {
      await scheduleBrahmaMuhurtaAlarm(alarmTimes.brahmaMuhurta);
      await schedulePrepareForSleepAlarm(alarmTimes.prepareForSleepTime);
      await cancelSleepReminder();
      await scheduleSleepReminder(alarmTimes.prepareForSleepTime);
      const now = new Date();
      await saveLastSynced(now);
      setLastSynced(now);
    } catch {
      // Sync failed - don't update timestamp
    } finally {
      setSyncing(false);
    }
  }, [alarmTimes, syncing]);

  const disableAlarms = useCallback(async () => {
    if (syncing) return;

    setSyncing(true);
    try {
      await cancelBrahmaMuhurtaAlarm();
      await cancelPrepareForSleepAlarm();
      await cancelSleepReminder();
      setLastSynced(null);
      await saveLastSynced(new Date(0));
    } catch {
      // Best-effort cancel
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  const toggleAutoUpdate = useCallback(async () => {
    const newValue = !autoUpdate;
    setAutoUpdate(newValue);
    await saveAutoUpdate(newValue);

    if (newValue) {
      await registerBackgroundAlarmTask();
    } else {
      await unregisterBackgroundAlarmTask();
    }
  }, [autoUpdate]);

  return { alarmTimes, autoUpdate, lastSynced, syncAlarms, disableAlarms, toggleAutoUpdate };
}
