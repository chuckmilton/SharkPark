// components/SubHeader.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SubHeaderProps {
  title: string;
  onBack: () => void;
  backgroundColor?: string;
}

export function SubHeader({ title, onBack, backgroundColor = '#EBA91B' }: SubHeaderProps) {
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  backIcon: {
    fontSize: 32,
    color: '#4b5563',
    fontWeight: '300',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    paddingTop: 8,
    color: '#111827',
  },
});