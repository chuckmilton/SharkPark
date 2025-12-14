import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';

// import {parkingLots} from '../data/mockParkingLots';
import {upcomingEvents} from '../data/mockEvents';
import {LongTermForecastScreenProps} from '../types/ui'
import {getOccupancyColor} from '../utils/parkingUtils';
import { SubHeader } from '../components/Header/SubHeader';


// TODO: Not reachable yet — main page navigation PENDING
export function LongTermForecastPage({ onBack }: LongTermForecastScreenProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  
  /**
   * Computes calendar metadata for given month; Used to render calendar grid layout
   * Given date within month, returns:
   * - year and month index
   * - daysInMonth; total days in month
   * - startingDayOfWeek; weekday index (0-5) of month's 1st day
   */
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return { year, month,
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
    };
  };

  const { year, month, daysInMonth, startingDayOfWeek } =
    getDaysInMonth(currentMonth);
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  const previousMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  const hasEvent = (day: number) => {
    return upcomingEvents.some(event => {
      const eventDate = event.date;
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };
  
  // fixed occupancy forecast for mock
  const generateForecastForDate = (date: Date) => {
    const map = [25, 85, 88, 90, 87, 75, 30];
    return map[date.getDay()];
  };


  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Top Banner */}
        <SubHeader title="Long-Term Forecast" onBack={onBack} />

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

        {/* Calendar */}
        <View style={styles.card}>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={previousMonth}>
              <Text style={styles.navIcon}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {monthNames[month]} {year}
            </Text>

            <TouchableOpacity onPress={nextMonth}>
              <Text style={styles.navIcon}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day Names */}
          <View style={styles.dayNamesRow}>
            {dayNames.map(day => (
              <Text key={day} style={styles.dayName}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {/* Empty date cells */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => 
              (<View key={`empty-${index}`} style={styles.dayCell} />
            ))}

            {/* Actual date cells */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;              
              const forecast = generateForecastForDate(new Date(year, month, day));

              const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === month &&
                selectedDate?.getFullYear() === year;

              return (
                 <TouchableOpacity key={day}
                  onPress={() => setSelectedDate(new Date(year, month, day))}
                  style={[
                    styles.dayCell,
                    isToday(day) && styles.todayCell,
                    isSelected && styles.selectedCell,
                  ]}
                >
                  <Text style={styles.dayText}>{day}</Text>

                  <View style={[ styles.occupancyBar,
                      {backgroundColor: getOccupancyColor(forecast)},
                  ]}/>

                  {/* Event indicator */}
                  {hasEvent(day) && <View style={styles.eventDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

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
  
  // Calendar
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  navIcon: {
    fontSize: 28,
    color: '#4b5563',
  },

  // Week day row
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
  },

  // Date Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  dayText: {
    fontSize: 12,
    color: '#111827',
  },

  todayCell: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },

  selectedCell: {
    borderWidth: 2,
    borderColor: '#EBA91B',
    borderRadius: 8,
  },
  
  eventDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },

  occupancyBar: {
    width: 28,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },

});
