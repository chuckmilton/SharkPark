import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TYPOGRAPHY, SPACING } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  logo?: ImageSourcePropType; // Image source - can be require() or URI
  title?: string; // Optional title text to display instead of logo
  onBack?: () => void; // Optional back navigation function
}

const Header: React.FC<HeaderProps> = React.memo(({ logo, title, onBack }) => {
  // Always call hooks in the same order
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.primary }]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.black }]}>←</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.centerContent}>
        {title ? (
          <Text style={[styles.titleText, { color: colors.textPrimary }]}>
            {title}
          </Text>
        ) : logo ? (
          <Image 
            source={logo} 
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <Text style={[styles.placeholderText, { color: colors.white }]}>
            🦈 SharkPark - Add logo.png to src/assets/images/
          </Text>
        )}
      </View>
      
      {/* Placeholder to balance the back button for centered content */}
      {onBack && <View style={styles.placeholder} />}
    </View>
  );
});

Header.displayName = 'Header';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
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
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  placeholder: {
    width: 44, // Match back button width for balance
    height: 44, // Match back button height for balance
  },
});

export default Header;
