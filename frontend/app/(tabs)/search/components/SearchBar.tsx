import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FilterOptions {
  modality: 'online' | 'presencial' | 'hibrido' | null;
  minRating: 'Bronce' | 'Plata' | 'Oro' | null;
  maxCost: number;
}

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onFilterChange,
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    modality: null,
    minRating: null,
    maxCost: 200,
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar habilidad..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={onSearchChange}
            onSubmitEditing={() => onSearch(searchQuery)}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options" size={22} color="#ff743dff" />
        </TouchableOpacity>
      </View>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            {/* Header */}
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
              {/* Modalidad */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Modalidad</Text>
                <View style={styles.optionsContainer}>
                  {(['online', 'presencial', 'hibrido'] as const).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        filters.modality === option && styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        handleFilterChange(
                          'modality',
                          filters.modality === option ? null : option
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          filters.modality === option && styles.optionTextActive,
                        ]}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Calificación Mínima */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Calificación Mínima</Text>
                <View style={styles.optionsContainer}>
                  {(['Bronce', 'Plata', 'Oro'] as const).map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.optionButton,
                        filters.minRating === rating && styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        handleFilterChange(
                          'minRating',
                          filters.minRating === rating ? null : rating
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          filters.minRating === rating && styles.optionTextActive,
                        ]}
                      >
                        {rating}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Costo Máximo */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Costo Máximo (tokens)</Text>
                <View style={styles.costSliderContainer}>
                  <Text style={styles.costValue}>{filters.maxCost}</Text>
                  <Text style={styles.costLabel}>tokens</Text>
                </View>
                <View style={styles.costOptions}>
                  {[50, 100, 150, 200].map((cost) => (
                    <TouchableOpacity
                      key={cost}
                      style={[
                        styles.costButton,
                        filters.maxCost === cost && styles.costButtonActive,
                      ]}
                      onPress={() => handleFilterChange('maxCost', cost)}
                    >
                      <Text
                        style={[
                          styles.costButtonText,
                          filters.maxCost === cost && styles.costButtonTextActive,
                        ]}
                      >
                        {cost}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setFilters({ modality: null, minRating: null, maxCost: 200 });
                  onFilterChange({ modality: null, minRating: null, maxCost: 200 });
                }}
              >
                <Text style={styles.resetButtonText}>Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 8,
  },

  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  filterModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },

  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  filterGroup: {
    marginBottom: 24,
  },

  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },

  optionButtonActive: {
    backgroundColor: '#ff743dff',
    borderColor: '#ff743dff',
  },

  optionText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  optionTextActive: {
    color: '#fff',
  },

  costSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  costValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff743dff',
  },

  costLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },

  costOptions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-around',
  },

  costButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
    flex: 1,
    alignItems: 'center',
  },

  costButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },

  costButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  costButtonTextActive: {
    color: '#fff',
  },

  filterActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },

  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
  },

  resetButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },

  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },

  applyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
