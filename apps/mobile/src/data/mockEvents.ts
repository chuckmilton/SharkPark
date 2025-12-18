import { Event } from '../types/ui';

export const upcomingEvents: Event[] = [
  {
    id: '1',
    name: 'Basketball Game vs. UCI',
    date: new Date(2025, 11, 15, 19, 0),
    affectedLots: ['G1', 'G2', 'G6', 'Pyramid'],
    description: 'Home basketball game. Expect heavy traffic near Pyramid and surrounding general lots 1-2 hours before game time.',
    impact: 'high'
  },
  {
    id: '2',
    name: 'Spring Career Fair',
    date: new Date(2026, 0, 28, 10, 0),
    affectedLots: ['G5', 'G7', 'G8', 'G12', 'E1', 'E2'],
    description: 'Large career fair event in USU. Central campus lots will be at maximum capacity. Employee lots E1-E2 may have overflow parking.',
    impact: 'high'
  },
  {
    id: '3',
    name: 'Final Exams Week',
    date: new Date(2025, 11, 16),
    affectedLots: ['all'],
    description: 'Finals week typically sees increased parking demand in the morning hours (7-10 AM) across all campus lots.',
    impact: 'medium'
  },
  {
    id: '4',
    name: 'Graduation Ceremony',
    date: new Date(2025, 11, 20, 9, 0),
    affectedLots: ['Pyramid', 'G1', 'G2', 'G3', 'G14'],
    description: 'Commencement ceremony at the Pyramid. Lots near the stadium will be reserved for graduates and families. Consider using remote lots.',
    impact: 'high'
  },
  {
    id: '5',
    name: 'Faculty Development Day',
    date: new Date(2026, 0, 15, 8, 0),
    affectedLots: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
    description: 'Professional development workshops for faculty and staff. Employee lots will be busier than usual throughout the day.',
    impact: 'medium'
  }
];