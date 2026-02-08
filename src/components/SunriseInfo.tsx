import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../lib/format';

interface SunriseInfoProps {
  sunriseTime: Date | null;
  sunsetTime: Date | null;
  city: string | null;
}

export default function SunriseInfo({ sunriseTime, sunsetTime, city }: SunriseInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.icon}>{'\u2600'}</Text>
        <View style={styles.textBlock}>
          <Text style={styles.label}>Sunrise</Text>
          <Text style={styles.time}>{formatTime(sunriseTime)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.icon}>{'\uD83C\uDF05'}</Text>
        <View style={styles.textBlock}>
          <Text style={styles.label}>Sunset</Text>
          <Text style={styles.time}>{formatTime(sunsetTime)}</Text>
        </View>
      </View>

      {city && <Text style={styles.city}>{city}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginRight: 16,
    width: 36,
    textAlign: 'center',
  },
  textBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#333333',
    marginVertical: 12,
    marginLeft: 52,
  },
  city: {
    fontSize: 13,
    color: '#666666',
    marginTop: 12,
    textAlign: 'center',
  },
});
