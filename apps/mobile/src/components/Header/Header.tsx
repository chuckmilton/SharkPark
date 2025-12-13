import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  logo?: ImageSourcePropType; // Image source - can be require() or URI
}

const Header: React.FC<HeaderProps> = ({ logo }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {logo ? (
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
  },
  logo: {
    height: 90,
    width: 300, // Adjust based on your logo dimensions
  },
  placeholderText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default Header;
