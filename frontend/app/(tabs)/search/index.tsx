import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text, TouchableOpacity, Modal, TextInput } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';


// Componenetes
// 1.- Barra Busqueda
const SearchBar = ({ searchQuery, onSearchChange, onSearch, onFilterChange }: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ modality: null, minRating: null, maxCost: 200 });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="¿Qué quieres aprender?"
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={() => onSearch(searchQuery)}
        />
        <TouchableOpacity onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={22} color="#ff743dff" />
        </TouchableOpacity>
      </View>

      <Modal visible={showFilters} transparent animationType="fade">
        <View style={[globalStyles.modalOverlay, {padding:20}]}>
          <View style={globalStyles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={globalStyles.modalTitle}>Filtrar Búsqueda</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.filterLabel}>Modalidad</Text>
              <View style={styles.chipRow}>
                {['online', 'presencial'].map((m) => (
                  <TouchableOpacity 
                    key={m} 
                    style={[styles.chip, filters.modality === m && styles.chipActive]}
                    onPress={() => handleFilterChange('modality', m)}
                  >
                    <Text style={[styles.chipText, filters.modality === m && styles.chipTextActive]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.filterLabel}>Costo Máximo ({filters.maxCost} tokens)</Text>
              <View style={styles.chipRow}>
                {[50, 100, 150, 200].map((c) => (
                  <TouchableOpacity 
                    key={c} 
                    style={[styles.chip, filters.maxCost === c && styles.chipActive]}
                    onPress={() => handleFilterChange('maxCost', c)}
                  >
                    <Text style={[styles.chipText, filters.maxCost === c && styles.chipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilters(false)}>
              <Text style={styles.applyBtnText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 2.- Tarjeta tutor
const TutorCard = ({ id, name, skill, rating, costPerSession, onViewProfile }: any) => {
  const getRankStyle = (r: string) => {
    switch (r) {
      case 'Oro': return { color: '#FFD700', label: 'Nivel Oro' };
      case 'Plata': return { color: '#C0C0C0', label: 'Nivel Plata' };
      default: return { color: '#CD7F32', label: 'Nivel Bronce' };
    }
  };
  const rank = getRankStyle(rating);

  return (
    <View style={styles.tutorCard}>
      <View style={styles.cardMain}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={30} color="#ccc" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.tutorName}>{name}</Text>
          <Text style={styles.tutorSkill}>{skill}</Text>
          <View style={styles.rankContainer}>
            <Ionicons name="ribbon" size={14} color={rank.color} />
            <Text style={[styles.rankText, { color: rank.color }]}>{rank.label}</Text>
          </View>
        </View>
        <View style={styles.priceInfo}>
          <Text style={styles.priceNum}>{costPerSession}</Text>
          <Text style={styles.priceSub}>tokens</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.cardBtn} onPress={() => onViewProfile(id, name)}>
        <Text style={styles.cardBtnText}>Ver Perfil Disponible</Text>
        <Ionicons name="chevron-forward" size={16} color="#ff743dff" />
      </TouchableOpacity>
    </View>
  );
};

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tutores, setTutores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const tutoresDestacados = [
    { userId: 1, name: '@AlexDev', skill: 'React Native', rating: 'Oro', costPerSession: 50 },
    { userId: 2, name: '@CarlosCode', skill: 'Python', rating: 'Plata', costPerSession: 40 },
    { userId: 3, name: '@MariaTS', skill: 'TypeScript', rating: 'Oro', costPerSession: 55 },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      setTimeout(() => {
        const filtered = tutoresDestacados.filter(t =>
          t.skill.toLowerCase().includes(query.toLowerCase())
        );
        setTutores(filtered);
        setLoading(false);
      }, 600);
    }
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      <Text style={globalStyles.headerTitle}>Explorar Habilidades</Text>

      {/* Barra de Búsqueda */}
      <View style={{ paddingHorizontal: 20 }}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onFilterChange={(f: any) => console.log("Filtros cambiados:", f)}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff743dff" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>
            {searchQuery ? `Resultados para "${searchQuery}"` : "Tutores Destacados"}
          </Text>

          {(searchQuery ? tutores : tutoresDestacados).map((tutor) => (
            <TutorCard
              key={tutor.userId}
              {...tutor}
              onViewProfile={(id: number) => router.push({ pathname: '/search/profileresult', params: { id } })}
            />
          ))}

          {searchQuery && tutores.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color="#ccc" />
              <Text style={{ color: '#999', marginTop: 10 }}>No hay resultados exactos</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
  const styles = StyleSheet.create({
    scrollContent: { 
      flex: 1, 
      paddingHorizontal: 20 
    },
    sectionLabel: { 
      fontSize: 18, 
      fontWeight: '600', 
      color: Colors.textMuted, 
      marginBottom: 15 
    },

    // Estilos SearchBar
    searchBarContainer: { 
      marginBottom: 15 
    },
    searchWrapper: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: '#fff', 
      borderRadius: 12, 
      paddingHorizontal: 15, 
      height: 55, 
      elevation: 3 
    },
    searchInput: { 
      flex: 1, 
      marginLeft: 10, 
      fontSize: 16 
    },
    modalHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginBottom: 20 
    },
    filterLabel: { 
      fontSize: 16, 
      fontWeight: '600', 
      marginTop: 15, 
      marginBottom: 10, 
      color: Colors.textMuted 
    },
    chipRow: { 
      flexDirection: 'row', 
      flexWrap: 'wrap' 
    },
    chip: { 
      paddingVertical: 8, 
      paddingHorizontal: 15, 
      borderRadius: 20, 
      borderWidth: 1, 
      borderColor: Colors.borderDefault, 
      marginRight: 10, 
      marginBottom: 10 
    },
    chipActive: { 
      backgroundColor: Colors.colorCard, 
      borderColor: Colors.BorderColor 
    },
    chipText: { 
      color: Colors.textMuted 
    },
    chipTextActive: { 
      color: Colors.textLight, 
      fontWeight: 'bold' 
    },
    applyBtn: { 
      backgroundColor: Colors.colorCard, 
      padding: 15, 
      borderRadius: 12, 
      alignItems: 'center',
       marginTop: 25 
      },
    applyBtnText: { 
      color: Colors.textLight, 
      fontWeight: 'bold' 
    },


    // Estilos TutorCard
    tutorCard: { 
      backgroundColor: Colors.whiteBg, 
      borderRadius: 16, 
      padding: 15, 
      marginBottom: 15, 
      elevation: 2 
    },
    cardMain: { 
      flexDirection: 'row', 
      alignItems: 'center' 
    },
    avatar: { 
      width: 60, 
      height: 60, 
      borderRadius: 30, 
      backgroundColor: '#f0f0f0', 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    cardInfo: { 
      flex: 1, 
      marginLeft: 15 
    },
    tutorName: { 
      fontSize: 17, 
      fontWeight: 'bold', 
      color: Colors.textDark 
    },
    tutorSkill: { 
      fontSize: 14, 
      color: Colors.primary, 
      fontWeight: '600' 
    },
    rankContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginTop: 2 
    },
    rankText: { 
      fontSize: 12, 
      fontWeight: 'bold', 
      marginLeft: 4, 
      textTransform: 'uppercase' 
    },
    priceInfo: { 
      alignItems: 'center' 
    },
    priceNum: { 
      fontSize: 20, 
      fontWeight: 'bold' 
    },
    priceSub: { 
      fontSize: 10, 
      color: Colors.textLabel 
    },
    cardBtn: { 
      marginTop: 15, 
      paddingTop: 15, 
      borderTopWidth: 1, 
      borderTopColor: Colors. borderLight, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    cardBtnText: { 
      color: Colors.primary, 
      fontWeight: 'bold', 
      marginRight: 5 
    },
    emptyContainer: { 
      alignItems: 'center', 
      marginTop: 40 
    }
  });