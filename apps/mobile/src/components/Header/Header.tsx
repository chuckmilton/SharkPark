import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

interface HeaderProps {
  logo?: ImageSourcePropType; // Image source - can be require() or URI
  title?: string; // Optional title text to display instead of logo
  onBack?: () => void; // Optional back navigation function
}

const Header: React.FC<HeaderProps> = ({ logo, title, onBack }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.centerContent}>
        {title ? (
          <Text style={styles.titleText}>
            {title}
          </Text>
        ) : logo ? (
          <Image 
            source={logo} 
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.placeholderText}>
            🦈 SharkPark - Add logo.png to src/assets/images/
          </Text>
        )}
      </View>
      
      {/* Placeholder to balance the back button for centered content */}
      {onBack && <View style={styles.placeholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 100, // Consistent header height
  },
  backButton: {
    padding: SPACING.sm,
    width: 44, // Standard touch target size
    height: 44, // Standard touch target size
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    color: COLORS.black,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100, // Match container height
  },
  logo: {
    height: 90, // Logo-specific dimensions
    width: 170, // Logo-specific dimensions
  },
  titleText: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    color: COLORS.textPrimary,
    textAlign: 'left',
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontFamily: 'System',
    alignSelf: 'flex-start',
    paddingLeft: SPACING.xxl,
    paddingTop: SPACING.xxxl - SPACING.xs, // 30px equivalent
    minHeight: 90, // Match logo height
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  placeholder: {
    width: 44, // Match back button width for balance
    height: 44, // Match back button height for balance
  },
});

export default Header;
