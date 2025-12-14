// SharkPark Theme Constants

export const COLORS = {
  // Primary colors
  primary: '#EBA91B',
  primaryDark: '#1e40af',
  
  // Neutral colors
  white: '#ffffff',
  black: '#1f2937',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;
