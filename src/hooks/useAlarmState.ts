import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import type { LocationData, AlarmTimes } from '../types';
import { getNextAlarmTimes } from '../lib/sunrise';
import { saveAutoUpdate, getAutoUpdate, saveLastSynced, getLastSynced } from '../lib/storage';
import { syncBothAlarms } from '../lib/alarm-scheduler';
import { registerBackgroundAlarmTask, unregisterBackgroundAlarmTask } from '../tasks/recalculate-alarm';

export function useAlarmState(location: LocationData | null) {
  const [alarmTimes, setAlarmTimes] = useState<AlarmTimes | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [au, ls] = await Promise.all([getAutoUpdate(), getLastSynced()]);
        if (!cancelled) {
          setAutoUpdate(au);
          setLastSynced(ls && ls.getTime() > 0 ? ls : null);
        }
      } catch {
        // defaults
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Calculate display times when location changes
  useEffect(() => {
    if (!location) { setAlarmTimes(null); return; }
    setAlarmTimes(getNextAlarmTimes(location.latitude, location.longitude));
  }, [location?.latitude, location?.longitude]);

  // Recalculate display times on foreground — NEVER touch native alarms
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && location) {
        setAlarmTimes(getNextAlarmTimes(location.latitude, location.longitude));
      }
    });
    return () => sub.remove();
  }, [location?.latitude, location?.longitude]);

  // Sync: set both native alarms (ONLY way to touch native alarms from UI)
  const syncAlarms = useCallback(async () => {
    if (!alarmTimes || syncing) return;
    setSyncing(true);
    try {
      await syncBothAlarms(alarmTimes.brahmaMuhurta, alarmTimes.prepareForSleepTime);
      const now = new Date();
      await saveLastSynced(now);
      setLastSynced(now);
    } catch {
      // failed
    } finally {
      setSyncing(false);
    }
  }, [alarmTimes, syncing]);

  // Toggle auto-update background task
  const toggleAutoUpdate = useCallback(async () => {
    const next = !autoUpdate;
    setAutoUpdate(next);
    await saveAutoUpdate(next);
    if (next) {
      await registerBackgroundAlarmTask();
    } else {
      await unregisterBackgroundAlarmTask();
    }
  }, [autoUpdate]);

  return { alarmTimes, autoUpdate, lastSynced, syncing, syncAlarms, toggleAutoUpdate };
}
