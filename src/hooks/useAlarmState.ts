import { useState, useEffect, useCallback } from 'react';
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

  const toggleAlarm = useCallback(async () => {
    if (!alarmTimes) return;

    const newEnabled = !enabled;
    setEnabled(newEnabled);
    await saveAlarmEnabled(newEnabled);

    if (newEnabled) {
      await scheduleBrahmaMuhurtaAlarm(alarmTimes.brahmaMuhurta);
      await scheduleSleepReminder(alarmTimes.sleepTime);
    } else {
      await cancelBrahmaMuhurtaAlarm();
      await cancelSleepReminder();
    }
  }, [enabled, alarmTimes]);

  const recalculate = useCallback(async () => {
    if (!location) return;

    const tomorrow = getTomorrow();
    const times = getAlarmTimes(tomorrow, location.latitude, location.longitude);
    setAlarmTimes(times);

    if (enabled) {
      await scheduleBrahmaMuhurtaAlarm(times.brahmaMuhurta);
      await scheduleSleepReminder(times.sleepTime);
    }
  }, [location, enabled]);

  return { enabled, alarmTimes, toggleAlarm, recalculate };
}
