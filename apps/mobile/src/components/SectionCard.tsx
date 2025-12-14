import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { Colors, Shadow} from '../constants/themes'


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
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    ...Shadow.sm,
    marginBottom: 24,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
});