import React from 'react';
import {View, Text, StyleSheet, ScrollView,} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

import {ShortTermForecastScreenProps} from '../types/ui'
import {getOccupancyColor} from '../utils/parkingUtils';
import {HourlyChart} from '../components/HourlyChart';
import {SubHeader} from '../components/Header/SubHeader';

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
      <SubHeader title="Short-Term Forecast" onBack={onBack} />

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
    backgroundColor: COLORS.lightGray,
  },

  scrollView: {
    flex: 1,
  },

  // Event Card
  eventsContainer: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },

  eventCard: {
    backgroundColor: COLORS.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warningBorder,
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.sm,
  },

  eventIcon: {
    marginTop: 2,
  },
  
  eventIconText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
  },
  
  eventContent: {
    flex: 1,
  },

  eventName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.warningText,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  eventDetails: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.warningTextSecondary,
    marginTop: SPACING.xs,
  },

  eventImpact: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.warningTextSecondary,
    marginTop: SPACING.xs,
  },

  // Title card + Status
  lotHeaderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.lg,
    padding: SPACING.xxxl,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  
  lotName: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: 'center',
  },

  statusBadge: {
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    borderRadius: SPACING.sm,
  },

  statusBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});