import React from 'react';
import {View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
// import {parkingLots} from '../data/mockParkingLots';
import {upcomingEvents} from '../data/mockEvents';
import {LongTermForecastScreenProps} from '../types/ui'



export function LongTermForecastPage({ onBack }: LongTermForecastScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Top Banner */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Long-Term Forecast</Text>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Events</Text>

          {upcomingEvents.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventName}>{event.name}</Text>

              <Text style={styles.eventDate}>
                {event.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>

              <Text style={styles.eventDescription}>
                {event.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#EBA91B',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },

  backIcon: {
    fontSize: 32,
    color: '#4b5563',
    fontWeight: '300',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },

  // Event Section
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000ff',
  },

  // Event card
  eventCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ebeae5ff', // event separator
  },

  eventName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  eventDate: {
    fontSize: 12,
    color: '#6b7280',
    marginVertical: 4,
  },
  
  eventDescription: {
    fontSize: 13,
    color: '#374151',
  },

});
