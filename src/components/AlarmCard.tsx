import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface AlarmCardProps {
  alarmTime: Date | null;
  enabled: boolean;
  onToggle: () => void;
}

function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function AlarmCard({ alarmTime, enabled, onToggle }: AlarmCardProps) {
  return (
    <View style={[styles.card, enabled ? styles.cardEnabled : styles.cardDisabled]}>
      <Text style={[styles.label, enabled ? styles.labelEnabled : styles.labelDisabled]}>
        Brahma Muhurta
      </Text>
      <Text style={[styles.time, enabled ? styles.timeEnabled : styles.timeDisabled]}>
        {formatTime(alarmTime)}
      </Text>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, enabled ? styles.toggleLabelEnabled : styles.toggleLabelDisabled]}>
          {enabled ? 'Alarm On' : 'Alarm Off'}
        </Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#333333', true: '#FFB800' }}
          thumbColor={enabled ? '#FFFFFF' : '#888888'}
        />
      </View>
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
  },
  cardEnabled: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#FFB800',
  },
  cardDisabled: {
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
  },
  labelEnabled: {
    color: '#FFB800',
  },
  labelDisabled: {
    color: '#888888',
  },
  time: {
    fontSize: 56,
    fontWeight: '200',
    marginBottom: 20,
  },
  timeEnabled: {
    color: '#FFFFFF',
  },
  timeDisabled: {
    color: '#888888',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleLabelEnabled: {
    color: '#FFB800',
  },
  toggleLabelDisabled: {
    color: '#888888',
  },
});
