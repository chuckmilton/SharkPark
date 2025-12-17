import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface SectionCardProps {
  title: string;
  children: ReactNode;
  style?: ViewStyle;
}

export function SectionCard({ title, children, style }: SectionCardProps) {
  return (
    <View style={[styles.section, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.lg,
    padding: SPACING.xxxl,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: SPACING.xxxl,
  },
  
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
});