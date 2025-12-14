import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SubHeader } from '../components/Header/SubHeader';
import { SectionCard } from '../components/SectionCard';
import { Colors, Shadow} from '../constants/theme'


interface SettingScreenProps {
  onBack: () => void;
}

type ThemeMode = 'light' | 'dark' | 'auto';

// TODO: Not reachable yet — main page navigation PENDING
export function SettingScreen({ onBack }: SettingScreenProps) {
  const [notifications, setNotifications] = useState({
    highOccupancy: true, favoriteLots: true, incidents: false,
  });
  const [theme, setTheme] = useState<ThemeMode>('light');

  const ToggleSwitch = ({ value }: { value: boolean }) => (
    <View style={[styles.toggleContainer, value ? styles.toggleActive : styles.toggleInactive]}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <SubHeader title="Settings" onBack={onBack} />

      {/* Screen Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Notification Card */}
        <SectionCard title="Notifications">
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>High Occupancy Alerts</Text>
                <Text style={styles.settingDescription}>Get notified when lots reach 80% capacity</Text>
              </View>
              <TouchableOpacity
                onPress={() => setNotifications(prev => ({ ...prev, highOccupancy: !prev.highOccupancy }))}
              >
                <ToggleSwitch value={notifications.highOccupancy} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Favorite Lot Updates</Text>
                <Text style={styles.settingDescription}>Receive updates on favorited parking lots</Text>
              </View>
              <TouchableOpacity
                onPress={() => setNotifications(prev => ({ ...prev, favoriteLots: !prev.favoriteLots }))}
              >
                <ToggleSwitch value={notifications.favoriteLots} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Incident Alerts</Text>
                <Text style={styles.settingDescription}>Get notified about parking lot incidents</Text>
              </View>
              <TouchableOpacity
                onPress={() => setNotifications(prev => ({ ...prev, incidents: !prev.incidents }))}
              >
                <ToggleSwitch value={notifications.incidents} />
              </TouchableOpacity>
            </View>
          </View>
        </SectionCard>                

        {/* Appearance Card */}
        <SectionCard title="Appearance">
          <View style={styles.themeList}>
            {/*Light Mode*/}
            <TouchableOpacity
              onPress={() => setTheme('light')}
              style={[styles.themeButton, theme === 'light' && styles.themeButtonActive]}
            >
              <Text style={styles.themeLabel}>Light Mode</Text>
              {theme === 'light' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>

            {/*Dark Mode*/}
            <TouchableOpacity
              onPress={() => setTheme('dark')}
              style={[styles.themeButton, theme === 'dark' && styles.themeButtonActive]}
            >
              <Text style={styles.themeLabel}>Dark Mode</Text>
              {theme === 'dark' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
            
            {/*Auto (System)*/}
            <TouchableOpacity
              onPress={() => setTheme('auto')}
              style={[styles.themeButton, theme === 'auto' && styles.themeButtonActive]}
            >
              <Text style={styles.themeLabel}>Auto (System)</Text>
              {theme === 'auto' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
          </View>
        </SectionCard>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },

  // Notification Card Children
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Toggle Switch
  toggleContainer: {
    width: 48,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.toggleActive,
  },
  toggleInactive: {
    backgroundColor: Colors.toggleInactive,
  },
  toggleThumb: { // toggle ball
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.toggleThumb,
    ...Shadow.toggle
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },

  // Theme Card
  themeList:{
    gap: 12,
  },
  themeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  themeButtonActive: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.themeActiveBackground,
  },
  themeLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.themeIndicator,
  },
});