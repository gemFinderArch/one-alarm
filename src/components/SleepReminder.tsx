import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../lib/format';

interface SleepReminderProps {
  sleepTime: Date | null;
}

export default function SleepReminder({ sleepTime }: SleepReminderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{'\u263D'}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Sleep by</Text>
        <Text style={styles.time}>{formatTime(sleepTime)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  time: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
  },
});
