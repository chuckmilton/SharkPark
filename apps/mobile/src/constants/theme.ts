export const Colors = {
  // Primary/Brand
  primary: '#EBA91B',
  primaryLight: '#FFD700',
  
  // Occupancy Colors
  occupancyLow: '#4ade80', // Green - <50%
  occupancyMedium: '#fbbf24', // Yellow - 50-75%
  occupancyHigh: '#ef4444', // Red - >75%
  
  // Event Card (Short-term style)
  eventBackground: '#fef3c7',
  eventBorder: '#fbbf24',
  eventName: '#78350f',
  eventDetails: '#a16207',
  eventImpact: '#ca8a04',
  
  // Grays
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Semantic UI Colors
  background: '#f3f4f6',
  cardBackground: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  divider: '#e5e7eb',
  eventSeparator: '#ebeae5ff',
  
  // Theme Toggle
  themeActiveBackground: '#fefce8',
  themeIndicator: '#FFD700',
  
  // Toggle Switch
  toggleActive: '#FFD700',
  toggleInactive: '#d1d5db',
  toggleThumb: '#ffffff',
} as const;



export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toggle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
} as const;