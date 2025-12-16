import React, { useState, useRef } from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import { parkingLots } from '../data/mockParkingLots';
import { getOccupancyColor } from '../utils/parkingUtils';
import { ParkingLotUI } from '../types/ui';
import { Header } from '../components';
import { LotFilterModal } from '../components/Modals/FilterModal';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const campusMapImage = require('../assets/images/CSULB_Map-1.png') as ImageSourcePropType;

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

const MapScreen: React.FC = () => {
  const [selectedLot, setSelectedLot] = useState<ParkingLotUI | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleLotPress = (lot: ParkingLotUI) => {
    setSelectedLot(lot);
    // TODO: Show lot details modal or navigate to lot details
    console.log('Selected lot:', lot.name, 'Occupancy:', lot.occupancy + '%');
  };

  const handleFilterPress = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilter = (filteredLots: string[]) => {
    setSelectedLots(filteredLots);
    setIsFilterModalOpen(false);
    console.log('Applied filter with lots:', filteredLots);
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
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.mapContainer}
        minimumZoomScale={0.5}
        maximumZoomScale={3.0}
        bouncesZoom={true}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
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

      {/* Selected lot indicator (temporary) */}
      {selectedLot && (
        <View style={styles.selectedLotIndicator}>
          <Text style={styles.selectedLotText}>
            {selectedLot.name} - {selectedLot.occupancy}% Full
          </Text>
        </View>
      )}

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
    paddingHorizontal: screenWidth * 1.0, // Increased horizontal padding
    paddingVertical: screenHeight * 0.5,  // Add vertical padding
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
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: COLORS.shadowDark,
    shadowOffset: {
      width: 0,
      height: 2,
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
    bottom: 100, // Above the tab bar
    left: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  selectedLotIndicator: {
    position: 'absolute',
    bottom: 30, // Above the tab bar (similar to filter button positioning)
    left: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: SPACING.sm,
    shadowColor: COLORS.shadowDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedLotText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

export default MapScreen;