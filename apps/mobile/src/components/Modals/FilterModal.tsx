import { useState } from 'react';
import {
  View, Text, Modal,
  TouchableOpacity, ScrollView,
  StyleSheet, Pressable,
} from 'react-native';
import { COLORS } from '../../constants/theme';

interface LotFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLots: string[];
  onApplyFilter: (selectedLots: string[]) => void;
}

interface LotOption {
  id: string;
  label: string;
  category: 'general' | 'employee';
}

export function LotFilterModal({ isOpen, onClose, selectedLots, onApplyFilter }: LotFilterModalProps) {  
  const [tempSelected, setTempSelected] = useState<string[]>(selectedLots);

  const generalLots: LotOption[] = [
    { id: 'G1', label: 'G1', category: 'general' },
    { id: 'G2', label: 'G2', category: 'general' },
    { id: 'G3', label: 'G3', category: 'general' },
    { id: 'G4', label: 'G4', category: 'general' },
    { id: 'G5', label: 'G5', category: 'general' },
    { id: 'G6', label: 'G6', category: 'general' },
    { id: 'G7', label: 'G7', category: 'general' },
    { id: 'G8', label: 'G8', category: 'general' },
    { id: 'G9', label: 'G9', category: 'general' },
    { id: 'G10', label: 'G10', category: 'general' },
    { id: 'G11', label: 'G11', category: 'general' },
    { id: 'G12', label: 'G12', category: 'general' },
    { id: 'G13', label: 'G13', category: 'general' },
    { id: 'G14', label: 'G14', category: 'general' },
    { id: 'PVN', label: 'Palo Verde N.', category: 'general' },
    { id: 'PVS', label: 'Palo Verde S.', category: 'general' },
    { id: 'PYR', label: 'Pyramid', category: 'general' },
  ];
  const employeeLots: LotOption[] = [
    { id: 'E1', label: 'E1', category: 'employee' },
    { id: 'E2', label: 'E2', category: 'employee' },
    { id: 'E3', label: 'E3', category: 'employee' },
    { id: 'E4', label: 'E4', category: 'employee' },
    { id: 'E5', label: 'E5', category: 'employee' },
    { id: 'E6', label: 'E6', category: 'employee' },
    { id: 'E7', label: 'E7', category: 'employee' },
    { id: 'E8', label: 'E8', category: 'employee' },
    { id: 'E9', label: 'E9', category: 'employee' },
    { id: 'E10', label: 'E10', category: 'employee' },
    { id: 'E11', label: 'E11', category: 'employee' },
    { id: 'E12', label: 'E12', category: 'employee' },
  ];

  const allLots = [...generalLots, ...employeeLots];

  const toggleLot = (lotId: string) => {    
    setTempSelected(
      // if selected, filter from incoming (+) array; otherwise add as is
      prev => prev.includes(lotId)? 
        // both return respective array
        prev.filter(id => id !== lotId) : [...prev, lotId]
    );    
  };

  const handleApply = () => {
    // pass local state to parent
    onApplyFilter(tempSelected);
    onClose();
  };

  const handleToggleAll = () => { // toggle between Select or Clear All
    if (tempSelected.length === 0) {
      // Select all
      setTempSelected(allLots.map(lot => lot.id));
    } else {
      // Clear all
      setTempSelected([]);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Backdrop touchable (dismiss modal) */}
        <Pressable style={styles.backdropPress} onPress={onClose} />
        
        {/* Modal */}
        <View style={styles.modal}>
          {/* Content */}
          <ScrollView style={styles.content}>
            {/* General Lot Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>General Lot</Text>
                {/* Close (X) Button*/}
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.grid}>
                {generalLots.map((lot) => (
                  <TouchableOpacity
                    key={lot.id}
                    onPress={() => toggleLot(lot.id)}
                    style={styles.lotButton}
                  >
                    <View style={[
                        styles.checkbox,
                        tempSelected.includes(lot.id) && styles.checkboxSelected]}>
                      {/* short-circuit rendering */}
                      {tempSelected.includes(lot.id) && (<Text style={styles.checkmark}>✓</Text>)}
                    </View>
                    
                    <Text style={styles.lotLabel}>{lot.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Employee Lot Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitleEmployee}>Employee Lot</Text>
              <View style={styles.grid}>
                {employeeLots.map((lot) => (
                  <TouchableOpacity
                    key={lot.id}
                    onPress={() => toggleLot(lot.id)}
                    style={styles.lotButton}
                  >
                    <View style={[
                      styles.checkbox,
                      tempSelected.includes(lot.id) && styles.checkboxSelected]}>
                      {tempSelected.includes(lot.id) && (<Text style={styles.checkmark}>✓</Text>)}
                    </View>
                    <Text style={styles.lotLabel}>{lot.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Select/Clear All Button */}
            <TouchableOpacity
              onPress={handleToggleAll}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>
                {tempSelected.length === 0 ? 'Select All' : 'Clear All'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleApply}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Filter Modal Specific Style
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdropPress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 448,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitleEmployee: {
    color: COLORS.mediumGray,
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
  closeIcon: {
    color: COLORS.mediumGray,
    fontSize: 24,
    fontWeight: '300',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  lotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '30%',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  lotLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    marginVertical: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});