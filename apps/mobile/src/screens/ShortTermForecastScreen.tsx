import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';

import {ShortTermForecastScreenProps} from '../types/ui'
import {getOccupancyColor} from '../utils/parkingUtils';
import {HourlyChart} from '../components/HourlyChart';

// TODO: Not reachable yet — main page navigation PENDING
export function ShortTermForecastScreen({ lot, onBack }: ShortTermForecastScreenProps) {
  const generateForecast = () => {
    const hours = [];
    
    const mockOccupancies = [
      15, 12, 18, 45, 68, 82, 75, 70, 72, 65, 
      58, 62, 55, 48, 42, 38, 32, 28, 22, 18,
    ];
    
    const hoursToShow = [];
    for (let h = 5; h <= 23; h++) {
      hoursToShow.push(h);
    }
    hoursToShow.push(0);
    
    for (let i = 0; i < hoursToShow.length; i++) {
      const hour = hoursToShow[i];
      const timeLabel = hour.toString();
      const occupancy = mockOccupancies[i];
      
      const accuracy = 92;
      const confidenceMargin = 3;

      const lowerBound = Math.max(0, occupancy - confidenceMargin);
      const upperBound = Math.min(100, occupancy + confidenceMargin);
      
      hours.push({
        time: timeLabel,
        occupancy: occupancy,
        accuracy,
        lowerBound: lowerBound,
        upperBound: upperBound,
      });
    }
    
    return hours;
  };

  const forecast = generateForecast();

  const getTodayEvents = () => {
    const events = [];
    
    events.push({
      name: 'Beach Volleyball Tournament',
      time: '14:00',
      location: 'Beach Courts',
      impact: 'Increased traffic in G-lots',
    });
    
    return events;
  };

  const todayEvents = getTodayEvents();

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Short-Term Forecast</Text>
        </View>
      </View>


      <ScrollView style={styles.scrollView}>
        {/* Event Notifications */}
        {todayEvents.length > 0 && (
          <View style={styles.eventsContainer}>
            {todayEvents.map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <View style={styles.eventIcon}>
                  <Text style={styles.eventIconText}>📅</Text>
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventDetails}>{event.time} • {event.location}</Text>
                  <Text style={styles.eventImpact}>{event.impact}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Title Card w/ Lot Name and Occupancy */}
        <View style={styles.lotHeaderCard}>
          <Text style={styles.lotName}>{lot.name}</Text>
          <View style={[styles.statusBadge, {backgroundColor: getOccupancyColor(lot.occupancy)}]}>
            <Text style={styles.statusBadgeText}>{lot.occupancy}%</Text>
          </View>
        </View>

        {/* Chart */}
        <HourlyChart data={forecast}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  // Banner
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
    paddingTop: 8,
    color: '#111827',
  },

  scrollView: {
    flex: 1,
  },

  // Event Card
  eventsContainer: {
    padding: 16,
    gap: 8,
  },

  eventCard: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },

  eventIcon: {
    marginTop: 2,
  },
  
  eventIconText: {
    fontSize: 20,
  },
  
  eventContent: {
    flex: 1,
  },

  eventName: {
    fontSize: 14,
    color: '#78350f',
    fontWeight: '600',
  },

  eventDetails: {
    fontSize: 12,
    color: '#a16207',
    marginTop: 4,
  },

  eventImpact: {
    fontSize: 12,
    color: '#ca8a04',
    marginTop: 4,
  },

  // Title card + Status
  lotHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    gap: 12,
  },
  
  lotName: {
    fontSize: 30,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
  },

  statusBadge: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
  },

  statusBadgeText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
  },


});