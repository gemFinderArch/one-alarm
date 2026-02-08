import React from 'react';
import {
  View,
  Text,
  Pressable,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { formatTime } from '../lib/format';

interface AlarmCardProps {
  brahmaMuhurtaTime: Date | null;
  pradoshaKaalTime: Date | null;
  autoUpdate: boolean;
  lastSynced: Date | null;
  syncing: boolean;
  onSync: () => void;
  onToggleAutoUpdate: () => void;
}

function formatLastSynced(date: Date | null): string {
  if (!date) return 'Not synced';

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (isToday) return `Last synced: today ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return `Last synced: yesterday ${time}`;

  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `Last synced: ${dateStr} ${time}`;
}

export default function AlarmCard({
  brahmaMuhurtaTime,
  pradoshaKaalTime,
  autoUpdate,
  lastSynced,
  syncing,
  onSync,
  onToggleAutoUpdate,
}: AlarmCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Brahma Muhurta</Text>
      <Text style={styles.time}>{formatTime(brahmaMuhurtaTime)}</Text>

      <View style={styles.divider} />

      <Text style={styles.label}>Pradosha Kaal</Text>
      <Text style={styles.time}>{formatTime(pradoshaKaalTime)}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.syncButton,
          pressed && styles.syncButtonPressed,
          syncing && styles.buttonDisabled,
        ]}
        onPress={onSync}
        disabled={syncing}
        accessibilityLabel="Sync alarms to device"
        accessibilityRole="button"
      >
        {syncing ? (
          <ActivityIndicator size="small" color="#0D0D0D" />
        ) : (
          <Text style={styles.syncButtonText}>Sync</Text>
        )}
      </Pressable>

      <View style={styles.autoUpdateRow}>
        <Text style={styles.autoUpdateLabel}>Auto-Update</Text>
        <Switch
          value={autoUpdate}
          onValueChange={onToggleAutoUpdate}
          trackColor={{ false: '#333333', true: '#FFB800' }}
          thumbColor={autoUpdate ? '#FFFFFF' : '#888888'}
          style={styles.autoUpdateSwitch}
          accessibilityLabel="Toggle automatic daily alarm updates"
        />
      </View>

      <Text style={styles.status}>{formatLastSynced(lastSynced)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    color: '#FFB800',
  },
  time: {
    fontSize: 56,
    fontWeight: '200',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  divider: {
    width: 40,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#444444',
    marginVertical: 16,
  },
  syncButton: {
    backgroundColor: '#FFB800',
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
    minWidth: 100,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  syncButtonPressed: {
    backgroundColor: '#E5A600',
  },
  syncButtonText: {
    color: '#0D0D0D',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  autoUpdateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  autoUpdateLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#999999',
  },
  autoUpdateSwitch: {
    transform: [{ scale: 0.8 }],
  },
  status: {
    fontSize: 12,
    color: '#666666',
  },
});
