import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { parkingLots } from '../data/mockParkingLots';
import { getOccupancyColor } from '../utils/parkingUtils';
import { ParkingLotUI } from '../types/ui';
import { Header } from '../components';
import { LotFilterModal } from '../components/Modals/FilterModal';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import type { MapStackParamList } from '../types/navigation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const campusMapImage = require('../assets/images/CSULB_map_transparent_unlabeled.webp') as ImageSourcePropType;

// Interactive lot component
const InteractiveLot: React.FC<{
  lot: ParkingLotUI;
  onPress: (lot: ParkingLotUI) => void;
}> = ({ lot, onPress }) => {
  const occupancyColor = getOccupancyColor(lot.occupancy);
  
  return (
    <TouchableOpacity
      style={[
        styles.lotCircle,
        {
          backgroundColor: occupancyColor,
          left: lot.position.x,
          top: lot.position.y,
        }
      ]}
      onPress={() => onPress(lot)}
      activeOpacity={0.7}
    >
      <Text style={styles.lotText}>{lot.name}</Text>
    </TouchableOpacity>
  );
};

// Filter button component
const FilterButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={styles.filterButton} onPress={onPress} activeOpacity={0.8}>
    <Icon name="filter" size={24} color={COLORS.white} />
  </TouchableOpacity>
);

// Navigate button component
const NavigateButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={styles.navigateButton} onPress={onPress} activeOpacity={0.8}>
    <Icon name="navigate" size={TYPOGRAPHY.fontSize.xxl} color={COLORS.white} />
  </TouchableOpacity>
);

const MapScreen: React.FC = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const navigation = useNavigation<StackNavigationProp<MapStackParamList>>();

  const handleLotPress = (lot: ParkingLotUI) => {
    // Navigate to ShortTermForecastScreen with lot data
    navigation.navigate('Short Term Forecast', { 
      lotId: lot.id, 
      lotName: lot.name 
    });
  };

  const handleFilterPress = () => {
    setIsFilterModalOpen(true);
  };

  const handleNavigatePress = () => {
    // TODO: Add navigation logic here (e.g., open Google Maps to campus)
  };

  const handleFilterClose = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilter = (filteredLots: string[]) => {
    setSelectedLots(filteredLots);
    setIsFilterModalOpen(false);
  };

  // Filter parking lots based on selected filter
  const filteredParkingLots = selectedLots.length > 0 
    ? parkingLots.filter(lot => selectedLots.includes(lot.id))
    : parkingLots;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        title="Map View"
      />

      {/* Scrollable map with zoom and pan */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.mapContainer}
        minimumZoomScale={0.5}
        maximumZoomScale={3.0}
        bouncesZoom={true}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentOffset={{ 
          x: screenWidth, // Center horizontally
          y: screenHeight   // Move down to center on the map image
        }}
      >
        {/* Campus map background */}
        <View style={styles.mapImageContainer}>
          <Image
            source={campusMapImage}
            style={styles.mapImage}
            resizeMode="contain"
          />
          
          {/* Interactive parking lot circles */}
          {filteredParkingLots.map((lot) => (
            <InteractiveLot
              key={lot.id}
              lot={lot}
              onPress={handleLotPress}
            />
          ))}
        </View>
      </ScrollView>

      {/* Filter button - bottom left */}
      <FilterButton onPress={handleFilterPress} />

      {/* Navigate button - bottom right */}
      <NavigateButton onPress={handleNavigatePress} />

      {/* Filter Modal */}
      <LotFilterModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterClose}
        selectedLots={selectedLots}
        onApplyFilter={handleApplyFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  mapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: screenHeight * 3, // Increase content area
    minWidth: screenWidth * 3,   // Increase content area
    paddingHorizontal: screenWidth * 0.75, // Reduced horizontal padding
    paddingVertical: screenHeight * 0.25,  // Reduced vertical padding
  },
  mapImageContainer: {
    position: 'relative',
  },
  mapImage: {
    width: screenWidth * 2.5, // Slightly larger for better zoom range
    height: screenHeight * 2.5,
  },
  lotCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SPACING.xs,
    borderColor: COLORS.white,
    shadowColor: COLORS.shadowDark,
    shadowOffset: {
      width: 0,
      height: SPACING.xs,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  lotText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    textAlign: 'center',
  },
  filterButton: {
    position: 'absolute',
    bottom: SPACING.xxl,
    left: SPACING.xxl, // Top right position
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadowDark,
    shadowOffset: {
      width: 0,
      height: SPACING.sm,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  navigateButton: {
    position: 'absolute',
    bottom: SPACING.xxl, // Same as filter button
    right: SPACING.xxl, // Symmetric position on the right
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadowDark,
    shadowOffset: {
      width: 0,
      height: SPACING.sm,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default MapScreen;