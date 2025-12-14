// components/SubHeader.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

interface SubHeaderProps {
  title: string;
  onBack: () => void;
  backgroundColor?: string;
}

export function SubHeader({ title, onBack, backgroundColor = COLORS.primary }: SubHeaderProps) {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.xxxl,
    paddingTop: SPACING.xxxl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.lg,
  },
  backIcon: {
    fontSize: TYPOGRAPHY.fontSize.xxxxl,
    color: COLORS.mediumGray,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    paddingTop: SPACING.md,
    color: COLORS.textPrimary,
  },
});