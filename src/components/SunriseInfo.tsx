import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SunriseInfoProps {
  sunriseTime: Date | null;
  city: string | null;
}

function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function SunriseInfo({ sunriseTime, city }: SunriseInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{'\u2600'}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Sunrise</Text>
        <Text style={styles.time}>{formatTime(sunriseTime)}</Text>
        {city && <Text style={styles.city}>{city}</Text>}
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
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  time: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  city: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
});
