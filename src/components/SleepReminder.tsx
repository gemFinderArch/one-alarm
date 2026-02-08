import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../lib/format';

interface SleepReminderProps {
  prepareForSleepTime: Date | null;
  sleepTime: Date | null;
}

export default function SleepReminder({ prepareForSleepTime, sleepTime }: SleepReminderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{'\u263D'}</Text>
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Prepare for Sleep</Text>
          <Text style={styles.time}>{formatTime(prepareForSleepTime)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Sleep by</Text>
          <Text style={styles.time}>{formatTime(sleepTime)}</Text>
        </View>
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
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#333333',
    marginVertical: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  time: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
  },
});
