import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  logo?: ImageSourcePropType; // Image source - can be require() or URI
  title?: string; // Optional title text to display instead of logo
}

const Header: React.FC<HeaderProps> = ({ logo, title }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 1,
    paddingBottom: 10,
    backgroundColor: '#EBA91B',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100, // Ensures consistent height (90px logo + 10px paddingBottom)
  },
  logo: {
    height: 90,
    width: 170, // Adjust based on your logo dimensions
  },
  titleText: {
    fontSize: 24,
    color: '#111827',
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'System',
    alignSelf: 'flex-start',
    paddingLeft: 24,
    paddingTop: 30,
    minHeight: 90,
  },
  placeholderText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default Header;
