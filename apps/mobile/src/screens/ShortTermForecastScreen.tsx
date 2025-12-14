import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {ShortTermForecastScreenProps} from '../types/ui'
import {getOccupancyColor} from '../utils/parkingUtils';
import {HourlyChart} from '../components/HourlyChart';
import {SubHeader} from '../components/Header/SubHeader';
import { Colors, Shadow } from '../constants/theme';
import { ReportModal } from '../components/Modals/ReportModal';


// TODO: Not reachable yet — main page navigation PENDING
export function ShortTermForecastScreen({ lot, onBack }: ShortTermForecastScreenProps) {
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  // const [isFavorite, setIsFavorite] = React.useState(false);

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
      
      {/* Favorite Button */}
      {/* <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => setIsFavorite(!isFavorite)}
        activeOpacity={0.7}
      >
        <Text style={styles.favoriteIcon}>
          {isFavorite ? '⭐' : '☆'}
        </Text>
      </TouchableOpacity> */}

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

      {/* Report Button */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setIsReportModalOpen(true)}
          activeOpacity={0.8}
        >
        <Text style={styles.fabIcon}>⚠️</Text>
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.eventBackground,
    borderLeftWidth: 4,
    borderLeftColor: Colors.eventBorder,
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
    color: Colors.eventName,
    fontWeight: '600',
  },
  eventDetails: {
    fontSize: 12,
    color: Colors.eventDetails,
    marginTop: 4,
  },
  eventImpact: {
    fontSize: 12,
    color: Colors.eventImpact,
    marginTop: 4,
  },

  // Title card + Status
  lotHeaderCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    ...Shadow.lg,
    alignItems: 'center',
    gap: 12,
  },  
  lotName: {
    fontSize: 30,
    color: Colors.text,
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
    color: Colors.cardBackground,
    fontWeight: '600',
  },
  
  // Report Button
  fab: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.occupancyHigh,
    justifyContent: 'center',
    alignItems: 'center',    
    elevation: 3,
  },
  fabIcon: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 24,
  },

  // // Favorite Button
  // favoriteButton: {
  //   position: 'absolute',
  //   top: 40, // Adjust based on your SubHeader height
  //   right: 16,
  //   padding: 8,
  //   zIndex: 10,
  // },
  // favoriteIcon: {
  //   fontSize: 24,
  // },
});