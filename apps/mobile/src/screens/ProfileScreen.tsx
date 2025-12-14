import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionCard } from '../components/SectionCard';
import { Header } from '../components';

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
            console.log('Logout pressed - functionality to be implemented');
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
          <Icon name="log-out-outline" size={20} color="#dc2626" />
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
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
    paddingBottom: 0, // Reduced padding to prevent content cutoff above nav bar
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
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  toggleContainer: {
    width: 48,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#FFD700',
  },
  toggleInactive: {
    backgroundColor: '#d1d5db',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  themeList: {
    gap: 12,
  },
  themeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  themeButtonActive: {
    borderColor: '#FFD700',
    backgroundColor: '#fefce8',
  },
  themeLabel: {
    fontSize: 15,
    color: '#111827',
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fecaca',
    justifyContent: 'center',
    marginTop: 8, // Consistent with other gaps
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
});

export default ProfileScreen;
