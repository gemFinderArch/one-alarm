import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../types';
import { useLocation } from '../hooks/useLocation';
import { useAlarmState } from '../hooks/useAlarmState';
import { setupNotificationChannel } from '../lib/sleep-notifier';
import { registerBackgroundAlarmTask } from '../tasks/recalculate-alarm';
import AlarmCard from '../components/AlarmCard';
import SunriseInfo from '../components/SunriseInfo';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { location, loading, reloadFromStorage } = useLocation();
  const {
    alarmTimes,
    autoUpdate,
    lastSynced,
    syncing,
    syncAlarms,
    toggleAutoUpdate,
  } = useAlarmState(location);

  useEffect(() => {
    setupNotificationChannel();
    registerBackgroundAlarmTask().catch(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      reloadFromStorage();
    }, [reloadFromStorage])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFB800" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.promptTitle}>Welcome to One Alarm</Text>
          <Text style={styles.promptText}>
            Set your location to calculate sunrise times and schedule your Brahma Muhurta alarm.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.settingsButtonText}>Set Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AlarmCard
          brahmaMuhurtaTime={alarmTimes?.brahmaMuhurta ?? null}
          pradoshaKaalTime={alarmTimes?.prepareForSleepTime ?? null}
          autoUpdate={autoUpdate}
          lastSynced={lastSynced}
          syncing={syncing}
          onSync={syncAlarms}
          onToggleAutoUpdate={toggleAutoUpdate}
        />
        <SunriseInfo
          sunriseTime={alarmTimes?.sunrise ?? null}
          sunsetTime={alarmTimes?.sunset ?? null}
          city={location.city}
        />
      </ScrollView>
      <TouchableOpacity
        style={styles.settingsLink}
        onPress={() => navigation.navigate('Settings')}
        hitSlop={{ top: 8, bottom: 8 }}
      >
        <Text style={styles.settingsLinkText}>Settings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: '#999999',
    fontSize: 16,
    marginTop: 12,
  },
  promptTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  promptText: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  settingsButton: {
    backgroundColor: '#FFB800',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  settingsButtonText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  settingsLink: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333333',
  },
  settingsLinkText: {
    color: '#999999',
    fontSize: 15,
    fontWeight: '500',
  },
});
