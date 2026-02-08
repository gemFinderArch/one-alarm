import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CITIES, City } from '../lib/cities';

interface CityPickerProps {
  onSelect: (city: City) => void;
  visible: boolean;
}

export default function CityPicker({ onSelect, visible }: CityPickerProps) {
  const [search, setSearch] = useState('');

  const filteredCities = search.length > 0
    ? CITIES.filter((city) =>
        city.name.toLowerCase().includes(search.toLowerCase())
      )
    : CITIES;

  const handleSelect = useCallback(
    (city: City) => {
      setSearch('');
      onSelect(city);
    },
    [onSelect]
  );

  const renderItem = useCallback(
    ({ item }: { item: City }) => (
      <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
        <Text style={styles.cityName}>{item.name}</Text>
        <Text style={styles.country}>{item.country}</Text>
      </TouchableOpacity>
    ),
    [handleSelect]
  );

  const keyExtractor = useCallback(
    (item: City) => `${item.name}-${item.country}`,
    []
  );

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search cities..."
        placeholderTextColor="#888888"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <FlatList
        data={filteredCities}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  list: {
    flex: 1,
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  cityName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  country: {
    fontSize: 14,
    color: '#888888',
  },
});
