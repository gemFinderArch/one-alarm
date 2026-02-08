import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { formatTime } from '../lib/format';

interface AlarmCardProps {
  alarmTime: Date | null;
  autoUpdate: boolean;
  lastSynced: Date | null;
  onSync: () => void;
  onDisable: () => void;
  onToggleAutoUpdate: () => void;
}

function formatLastSynced(date: Date | null): string {
  if (!date || date.getTime() === 0) return 'Not synced';

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
  alarmTime,
  autoUpdate,
  lastSynced,
  onSync,
  onDisable,
  onToggleAutoUpdate,
}: AlarmCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Brahma Muhurta</Text>
      <Text style={styles.time}>{formatTime(alarmTime)}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.syncButton} onPress={onSync} activeOpacity={0.7}>
          <Text style={styles.syncButtonText}>Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.disableButton} onPress={onDisable} activeOpacity={0.7}>
          <Text style={styles.disableButtonText}>Disable</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.autoUpdateRow}>
        <Text style={styles.autoUpdateLabel}>Auto-Update</Text>
        <Switch
          value={autoUpdate}
          onValueChange={onToggleAutoUpdate}
          trackColor={{ false: '#333333', true: '#FFB800' }}
          thumbColor={autoUpdate ? '#FFFFFF' : '#888888'}
          style={styles.autoUpdateSwitch}
          accessibilityLabel="Toggle automatic alarm updates"
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
    marginBottom: 20,
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  syncButton: {
    backgroundColor: '#FFB800',
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  syncButtonText: {
    color: '#0D0D0D',
    fontSize: 15,
    fontWeight: '700',
  },
  disableButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#444444',
  },
  disableButtonText: {
    color: '#999999',
    fontSize: 15,
    fontWeight: '600',
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
