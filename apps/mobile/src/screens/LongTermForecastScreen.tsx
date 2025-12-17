import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageSourcePropType, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { upcomingEvents } from '../data/mockEvents';
import { getOccupancyColor } from '../utils/parkingUtils';

const LongTermForecastScreen: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const logo = require('../assets/images/SharkParkV4.webp') as ImageSourcePropType;
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  
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
  
  const generateForecastForDate = (date: Date) => {
    const map = [25, 85, 88, 90, 87, 75, 30];
    return map[date.getDay()];
  };
  
  return (
    <View style={styles.container}>
      <Header 
        logo={logo}
      />
      
      <SafeAreaView style={styles.content}>
        <ScrollView>
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.lg,
    padding: SPACING.xl,
    margin: SPACING.xxxl,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.lg,
    color: COLORS.textFull,
  },
  eventCard: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  eventName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  eventDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray,
    marginVertical: SPACING.xs,
  },
  eventDescription: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.darkGray,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  monthTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  navIcon: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    color: COLORS.mediumGray,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  dayText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  todayCell: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SPACING.md,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: SPACING.md,
  },
  eventDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
  },
  occupancyBar: {
    width: 28,
    height: 6,
    borderRadius: 3,
    marginTop: SPACING.xs,
  },
});

export default LongTermForecastScreen;
