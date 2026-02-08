import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import type { LocationData, AlarmTimes } from '../types';
import { getAlarmTimes } from '../lib/sunrise';
import { saveAlarmEnabled, getAlarmEnabled } from '../lib/storage';
import { scheduleBrahmaMuhurtaAlarm, cancelBrahmaMuhurtaAlarm } from '../lib/alarm-scheduler';
import { scheduleSleepReminder, cancelSleepReminder } from '../lib/sleep-notifier';

function getTomorrow(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export function useAlarmState(location: LocationData | null) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [alarmTimes, setAlarmTimes] = useState<AlarmTimes | null>(null);
  const [toggling, setToggling] = useState(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // Load enabled state from storage on mount
  useEffect(() => {
    let cancelled = false;

    async function loadEnabled() {
      try {
        const savedEnabled = await getAlarmEnabled();
        if (!cancelled) {
          setEnabled(savedEnabled);
        }
      } catch {
        // Default to false on error
      }
    }

    loadEnabled();

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

    const tomorrow = getTomorrow();
    const times = getAlarmTimes(tomorrow, location.latitude, location.longitude);
    setAlarmTimes(times);
  }, [location]);

  // Recalculate on app foreground (fixes stale times on new day)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && location) {
        const tomorrow = getTomorrow();
        const times = getAlarmTimes(tomorrow, location.latitude, location.longitude);
        setAlarmTimes(times);

        if (enabledRef.current) {
          cancelBrahmaMuhurtaAlarm()
            .then(() => scheduleBrahmaMuhurtaAlarm(times.brahmaMuhurta))
            .catch(() => {});
          cancelSleepReminder()
            .then(() => scheduleSleepReminder(times.sleepTime))
            .catch(() => {});
        }
      }
    });

    return () => subscription.remove();
  }, [location]);

  const toggleAlarm = useCallback(async () => {
    if (!alarmTimes || toggling) return;

    setToggling(true);
    const newEnabled = !enabledRef.current;

    try {
      if (newEnabled) {
        await scheduleBrahmaMuhurtaAlarm(alarmTimes.brahmaMuhurta);
        await scheduleSleepReminder(alarmTimes.sleepTime);
      } else {
        await cancelBrahmaMuhurtaAlarm();
        await cancelSleepReminder();
      }
      setEnabled(newEnabled);
      await saveAlarmEnabled(newEnabled);
    } catch {
      // Revert on failure - don't change state
    } finally {
      setToggling(false);
    }
  }, [alarmTimes, toggling]);

  const recalculate = useCallback(async () => {
    if (!location) return;

    const tomorrow = getTomorrow();
    const times = getAlarmTimes(tomorrow, location.latitude, location.longitude);
    setAlarmTimes(times);

    if (enabledRef.current) {
      await cancelBrahmaMuhurtaAlarm();
      await cancelSleepReminder();
      await scheduleBrahmaMuhurtaAlarm(times.brahmaMuhurta);
      await scheduleSleepReminder(times.sleepTime);
    }
  }, [location]);

  return { enabled, alarmTimes, toggleAlarm, recalculate };
}
