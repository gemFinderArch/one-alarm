import { useState, useEffect, useCallback } from 'react';
import { LocationData } from '../types';
import { getCurrentLocation } from '../lib/location';
import { saveLocation, getLocation } from '../lib/storage';
import { City } from '../lib/cities';

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, load any previously saved location from AsyncStorage
  useEffect(() => {
    let cancelled = false;

    async function loadSavedLocation() {
      try {
        const saved = await getLocation();
        if (!cancelled) {
          setLocation(saved);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load saved location');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSavedLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Detect the user's location via GPS and save it to storage.
   */
  const setLocationFromGPS = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loc = await getCurrentLocation();
      if (loc) {
        setLocation(loc);
        await saveLocation(loc);
      } else {
        setError('Unable to determine location. Please check permissions.');
      }
    } catch {
      setError('Failed to get GPS location');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Set the location from a manually selected city and save it to storage.
   */
  const setLocationFromCity = useCallback(async (city: City) => {
    setLoading(true);
    setError(null);

    try {
      const loc: LocationData = {
        latitude: city.latitude,
        longitude: city.longitude,
        city: city.name,
      };
      setLocation(loc);
      await saveLocation(loc);
    } catch {
      setError('Failed to save location');
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, error, setLocationFromGPS, setLocationFromCity };
}
