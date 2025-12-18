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
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { upcomingEvents } from '../data/mockEvents';
import { getOccupancyColor } from '../utils/parkingUtils';

const LongTermForecastScreen: React.FC = () => {
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.lightGray }]}>
      <Header 
        logo={logo}
      />
      
      <SafeAreaView style={styles.content}>
        <ScrollView>
          {/* Upcoming Events */}
          <View style={[styles.card, { backgroundColor: colors.white, shadowColor: colors.shadowDark }]}>
            <Text style={[styles.cardTitle, { color: colors.textFull }]}>Upcoming Events</Text>

            {upcomingEvents.map(event => (
              <View key={event.id} style={[styles.eventCard, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.eventName, { color: colors.textPrimary }]}>{event.name}</Text>

                <Text style={[styles.eventDate, { color: colors.gray }]}>
                  {event.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>

                <Text style={[styles.eventDescription, { color: colors.darkGray }]}>
                  {event.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar */}
          <View style={[styles.card, { backgroundColor: colors.white, shadowColor: colors.shadowDark }]}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={previousMonth}>
                <Text style={[styles.navIcon, { color: colors.mediumGray }]}>‹</Text>
              </TouchableOpacity>

              <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>
                {monthNames[month]} {year}
              </Text>

              <TouchableOpacity onPress={nextMonth}>
                <Text style={[styles.navIcon, { color: colors.mediumGray }]}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Day Names */}
            <View style={styles.dayNamesRow}>
              {dayNames.map(day => (
                <Text key={day} style={[styles.dayName, { color: colors.gray }]}>{day}</Text>
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
                      isToday(day) && { backgroundColor: colors.lightGray, borderRadius: SPACING.md },
                      isSelected && { borderWidth: 2, borderColor: colors.primary, borderRadius: SPACING.md },
                    ]}
                  >
                    <Text style={[styles.dayText, { color: colors.textPrimary }]}>{day}</Text>

                    <View style={[ styles.occupancyBar,
                        {backgroundColor: getOccupancyColor(forecast)},
                    ]}/>

                    {/* Event indicator */}
                    {hasEvent(day) && <View style={[styles.eventDot, { backgroundColor: colors.error }]} />}
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
  },
  content: {
    flex: 1,
  },
  card: {
    borderRadius: SPACING.lg,
    padding: SPACING.xl,
    margin: SPACING.xxxl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.lg,
  },
  eventCard: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  eventName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  eventDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginVertical: SPACING.xs,
  },
  eventDescription: {
    fontSize: TYPOGRAPHY.fontSize.xs,
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
  },
  navIcon: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
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
  },
  eventDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  occupancyBar: {
    width: 28,
    height: 6,
    borderRadius: 3,
    marginTop: SPACING.xs,
  },
});

export default LongTermForecastScreen;
