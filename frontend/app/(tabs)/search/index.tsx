import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text, TouchableOpacity, TextInput, Modal } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getMatchesRequest, type MatchItem } from '../../_utils/api';
import { getToken } from '../../_utils/authStorage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const CATEGORIAS = [
  'Todas',
  'Matemáticas',
  'Ciencias',
  'Idiomas',
  'Programación',
  'Diseño',
  'Negocios',
  'Académico',
  'Frontend',
];

const normalizar = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const SearchBar = ({ searchQuery, onSearchChange, onSearch, onCategoriaChange, categoriaActiva }: any) => {
  const [showFilters, setShowFilters] = useState(false);

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
          <Ionicons
            name="options-outline"
            size={22}
            color={categoriaActiva !== 'Todas' ? Colors.primary : '#ff743dff'}
          />
        </TouchableOpacity>
      </View>

      {categoriaActiva !== 'Todas' && (
        <TouchableOpacity
          style={styles.categoriaChip}
          onPress={() => onCategoriaChange('Todas')}
        >
          <Text style={styles.categoriaChipText}>{categoriaActiva}</Text>
          <Ionicons name="close-circle" size={16} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal visible={showFilters} transparent animationType="fade">
        <View style={[globalStyles.modalOverlay, { padding: 20 }]}>
          <View style={globalStyles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={globalStyles.modalTitle}>Filtrar por categoría</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoriaItem,
                    categoriaActiva === cat && styles.categoriaItemActiva
                  ]}
                  onPress={() => {
                    onCategoriaChange(cat);
                    setShowFilters(false);
                  }}
                >
                  <Text style={[
                    styles.categoriaItemText,
                    categoriaActiva === cat && styles.categoriaItemTextActiva
                  ]}>
                    {cat}
                  </Text>
                  {categoriaActiva === cat && (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const TutorCard = ({
  id,
  name,
  skill,
  onViewProfile,
}: {
  id: number;
  name: string;
  skill: string;
  onViewProfile: (id: number) => void;
}) => {
  return (
    <View style={styles.tutorCard}>
      <View style={styles.cardMain}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={30} color="#ccc" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.tutorName}>{name}</Text>
          <Text style={styles.tutorSkill}>{skill}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.cardBtn} onPress={() => onViewProfile(id)}>
        <Text style={styles.cardBtnText}>Ver perfil disponible</Text>
        <Ionicons name="chevron-forward" size={16} color="#ff743dff" />
      </TouchableOpacity>
    </View>
  );
};

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [tutores, setTutores] = useState<MatchItem[]>([]);
  const [allTutores, setAllTutores] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  useFocusEffect(
    useCallback(() => {
      loadMatches(categoriaActiva !== 'Todas' ? categoriaActiva : undefined);
    }, [categoriaActiva]) // 
  );
  const loadMatches = async (categoria?: string) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      const data = await getMatchesRequest(
        token,
        categoria && categoria !== 'Todas' ? categoria : undefined
      );
      setAllTutores(data);
      setTutores(data);
    } catch (error) {
      console.error('Error cargando matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setTutores(allTutores);
      return;
    }

    const filtered = allTutores.filter((t) =>
      t.habilidades.some((h) =>
        normalizar(h).includes(normalizar(query))
      )
    );

    setTutores(filtered);
  };

  const handleCategoriaChange = (categoria: string) => {
    setCategoriaActiva(categoria);
    setSearchQuery('');
    loadMatches(categoria);
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      <Text style={[globalStyles.headerTitle,{color: Colors.TextprimaryDark}]}>Explorar habilidades</Text>

      <View style={{ paddingHorizontal: 20 }}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(text: string) => handleSearch(text)}
          onSearch={handleSearch}
          onCategoriaChange={handleCategoriaChange}
          categoriaActiva={categoriaActiva}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff743dff" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionLabel, { color: Colors.TextprimaryDark }]}>
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : categoriaActiva !== 'Todas'
                ? `Categoría: ${categoriaActiva}`
                : 'Matches sugeridos'}
          </Text>

          {tutores.map((tutor) => (
            <TutorCard
              key={tutor.id}
              id={tutor.id}
              name={`@${tutor.alias}`}
              skill={tutor.habilidades.join(', ')}
              onViewProfile={(id) =>
                router.push({
                  pathname: '/(tabs)/search/profileresult',
                  params: { id: String(id) },
                })
              }
            />
          ))}

          {!loading && tutores.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color="#ccc" />
              <Text style={{ color: '#999', marginTop: 10 }}>
                No hay resultados
              </Text>
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
  cardBtn: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
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
  },
  categoriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
  },
  categoriaChipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  categoriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  categoriaItemActiva: {
    backgroundColor: Colors.primary,
  },
  categoriaItemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  categoriaItemTextActiva: {
    color: '#fff',
    fontWeight: '700',
  },
});