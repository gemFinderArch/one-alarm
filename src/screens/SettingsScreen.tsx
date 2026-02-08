import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocation } from '../hooks/useLocation';
import CityPicker from '../components/CityPicker';
import type { City } from '../lib/cities';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { location, loading, error, setLocationFromGPS, setLocationFromCity } = useLocation();

  const handleCitySelect = async (city: City) => {
    await setLocationFromCity(city);
    navigation.goBack();
  };

  const handleDetectLocation = async () => {
    await setLocationFromGPS();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        {/* Current location display */}
        {location && (
          <View style={styles.currentLocation}>
            <Text style={styles.currentLabel}>Current Location</Text>
            <Text style={styles.currentCity}>{location.city}</Text>
            <Text style={styles.coordinates}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        {/* Detect location button */}
        <TouchableOpacity
          style={styles.detectButton}
          onPress={handleDetectLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#0D0D0D" />
          ) : (
            <Text style={styles.detectButtonText}>Detect My Location</Text>
          )}
        </TouchableOpacity>

        {/* Error message */}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* City picker section */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or select a city</Text>
          <View style={styles.dividerLine} />
        </View>

        <CityPicker onSelect={handleCitySelect} visible={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  currentLocation: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFB800',
  },
  currentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  currentCity: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 13,
    color: '#888888',
  },
  detectButton: {
    backgroundColor: '#FFB800',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  detectButtonText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#888888',
    fontSize: 13,
    marginHorizontal: 12,
  },
});
