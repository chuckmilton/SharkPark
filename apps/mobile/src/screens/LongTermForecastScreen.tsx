import React from 'react';
import {View, Text, StyleSheet,} from 'react-native';
// import {parkingLots} from '../data/mockParkingLots';
// import {upcomingEvents} from '../data/mockEvents';

export function LongTermForecastPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Long-Term Forecast</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
});
