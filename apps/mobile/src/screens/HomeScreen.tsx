import React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components';
import { COLORS } from '../constants/theme';

const HomeScreen: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const logo = require('../assets/images/SharkParkV3.png') as ImageSourcePropType;
  
  return (
    <View style={styles.container}>
      <Header 
        logo={logo}
      />
      
      <SafeAreaView style={styles.content}>
        {/* Content will be added here */}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;
