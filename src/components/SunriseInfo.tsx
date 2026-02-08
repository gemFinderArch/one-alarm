import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime, formatShortDate } from '../lib/format';

interface SunriseInfoProps {
  sunriseTime: Date | null;
  sunsetTime: Date | null;
  city: string | null;
}

interface RowData {
  icon: string;
  label: string;
  time: Date | null;
}

function SolarRow({ icon, label, time }: RowData) {
  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textBlock}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.date}>{formatShortDate(time)}</Text>
        </View>
        <Text style={styles.time}>{formatTime(time)}</Text>
      </View>
    </View>
  );
}

export default function SunriseInfo({ sunriseTime, sunsetTime, city }: SunriseInfoProps) {
  // Whichever comes next goes on top
  const sunriseFirst =
    !sunsetTime || (sunriseTime && sunriseTime <= sunsetTime);

  const first: RowData = sunriseFirst
    ? { icon: '\u2600', label: 'Sunrise', time: sunriseTime }
    : { icon: '\uD83C\uDF05', label: 'Sunset', time: sunsetTime };

  const second: RowData = sunriseFirst
    ? { icon: '\uD83C\uDF05', label: 'Sunset', time: sunsetTime }
    : { icon: '\u2600', label: 'Sunrise', time: sunriseTime };

  return (
    <View style={styles.container}>
      <SolarRow {...first} />
      <View style={styles.divider} />
      <SolarRow {...second} />
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
  labelRow: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  date: {
    fontSize: 11,
    fontWeight: '400',
    color: '#666666',
    marginTop: 2,
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
