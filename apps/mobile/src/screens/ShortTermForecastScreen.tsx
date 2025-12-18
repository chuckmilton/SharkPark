import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { Header } from '../components';
import { useTheme } from '../context/ThemeContext';

import {getOccupancyColor} from '../utils/parkingUtils';
import {HourlyChart} from '../components/HourlyChart';
import { ReportModal } from '../components/Modals/ReportModal';
import { parkingLots } from '../data/mockParkingLots';
import type { MapStackScreenProps } from '../types/navigation';

// Navigation-aware component
export function ShortTermForecastScreen() {
  const navigation = useNavigation();
  const route = useRoute<MapStackScreenProps<'Short Term Forecast'>['route']>();
  const { lotId } = route.params || { lotId: 'G1' };
  const { colors } = useTheme();
  
  // Find the lot from our data
  const lot = parkingLots.find(l => l.id === lotId) || parkingLots[0];
  
  const onBack = () => navigation.goBack();
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

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
    <View style={[styles.container, { backgroundColor: colors.lightGray }]}>
      {/* Top Banner */}
      <Header title="Short-Term Forecast" onBack={onBack}/>

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
        <View style={[styles.lotHeaderCard, { backgroundColor: colors.white }]}>
          <Text style={[styles.lotName, { color: colors.textPrimary }]}>{lot.name}</Text>
          <View style={[styles.statusBadge, {backgroundColor: getOccupancyColor(lot.occupancy)}]}>
            <Text style={styles.statusBadgeText}>{lot.occupancy}%</Text>
          </View>
        </View>

        {/* Chart */}
        <HourlyChart data={forecast}/>
      </ScrollView>

      {/* Report Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsReportModalOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>⚠️</Text>
      </TouchableOpacity>

      {/* Navigate Button (bottom right, symmetric to report button) */}
      <TouchableOpacity
        style={styles.fabNavigate}
        onPress={() => { /* TODO: Add navigation logic here */ }}
        activeOpacity={0.8}
      >
        <Icon name="navigate" size={TYPOGRAPHY.fontSize.xxl} color={COLORS.white} />
      </TouchableOpacity>

      {/* Incident Report Modal */}
      <ReportModal
        lotId={lot.id}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={() => {}} // currently do nothing on submit
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: SPACING.lg,
    padding: SPACING.xxxl,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: SPACING.xs },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  
  lotName: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
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

  // Report Button
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl, // 30px equivalent
    left: SPACING.xxl,
    width: 56, // Standard FAB size
    height: 56, // Standard FAB size
    borderRadius: 28, // Half of width/height for circle
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',    
    elevation: 3,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: SPACING.xs },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabNavigate: {
    position: 'absolute',
    bottom: SPACING.xxl, // Same as report button
    right: SPACING.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: SPACING.xs },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.xxl,
  },
});