import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionCard } from '../components/SectionCard';
import { Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'auto';

const ProfileScreen: React.FC = () => {
  const [notifications, setNotifications] = useState({
    highOccupancy: true, favoriteLots: true, incidents: false,
  });
  const [theme, setTheme] = useState<ThemeMode>('light');

  const ToggleSwitch = ({ value }: { value: boolean }) => (
    <View style={[styles.toggleContainer, value ? styles.toggleActive : styles.toggleInactive]}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </View>
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual logout logic
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        title="Profile & Settings"
      />

      {/* Scrollable Content */}
      <SafeAreaView style={styles.scrollView}>
        <ScrollView contentContainerStyle={styles.content}>
        {/* Notification Settings */}
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

        {/* Appearance Settings */}
        <SectionCard title="Appearance">
          <View style={styles.themeList}>
            <TouchableOpacity
              onPress={() => setTheme('light')}
              style={[styles.themeButton, theme === 'light' && styles.themeButtonActive]}
            >
              <Text style={styles.themeLabel}>Light Mode</Text>
              {theme === 'light' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTheme('dark')}
              style={[styles.themeButton, theme === 'dark' && styles.themeButtonActive]}
            >
              <Text style={styles.themeLabel}>Dark Mode</Text>
              {theme === 'dark' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setTheme('auto')}
              style={[styles.themeButton, theme === 'auto' && styles.themeButtonActive]}
            >
              <Text style={styles.themeLabel}>Auto (System)</Text>
              {theme === 'auto' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color={COLORS.errorText} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.xxxl,
    gap: SPACING.xxxl,
    paddingBottom: 0, // Reduced padding to prevent content cutoff above nav bar
  },
  settingsList: {
    gap: SPACING.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderGray,
  },
  toggleContainer: {
    width: 48,
    height: 24,
    borderRadius: SPACING.lg,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleInactive: {
    backgroundColor: COLORS.toggleGray,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  themeList: {
    gap: SPACING.sm,
  },
  themeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
  },
  themeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.yellowLight,
  },
  themeLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.black,
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    padding: SPACING.lg,
    borderRadius: SPACING.lg, // More rounded
    borderWidth: 2,
    borderColor: COLORS.errorBorder,
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  logoutButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.errorText,
    marginLeft: SPACING.md,
  },
});

export default ProfileScreen;
