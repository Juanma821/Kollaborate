import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TutorCard from './components/TutorCard';
import type { FilterOptions } from './_utils/types';

// API Base URL - Ajusta según tu configuración
const API_BASE_URL = 'http://localhost:3000/api';

interface Tutor {
  userId: number;
  name: string;
  skill: string;
  rating?: 'Oro' | 'Plata' | 'Bronce';
  profileImage?: string;
  costPerSession?: number;
}

interface FilterOptions {
  modality: 'online' | 'presencial' | 'hibrido' | null;
  minRating: 'Bronce' | 'Plata' | 'Oro' | null;
  maxCost: number;
}

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    modality: null,
    minRating: null,
    maxCost: 200,
  });

  // Mock data - Tutores destacados
  const tutoresDestacados: Tutor[] = [
    {
      userId: 1,
      name: '@AlexDev',
      skill: 'React Native',
      rating: 'Oro',
      costPerSession: 50,
    },
    {
      userId: 2,
      name: '@CarlosCode',
      skill: 'Python',
      rating: 'Plata',
      costPerSession: 40,
    },
    {
      userId: 3,
      name: '@MariaTS',
      skill: 'TypeScript',
      rating: 'Oro',
      costPerSession: 55,
    },
    {
      userId: 4,
      name: '@JuanWeb',
      skill: 'HTML/CSS',
      rating: 'Bronce',
      costPerSession: 30,
    },
  ];

  // Fetch tutores al cargar o cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchTutoresPorHabilidad(searchQuery);
    }
  }, [searchQuery]);

  const fetchTutoresPorHabilidad = async (skill: string) => {
    setLoading(true);
    try {
      // Esta sería la llamada real al backend
      // const response = await fetch(`${API_BASE_URL}/skills?name=${skill}`);
      // const data = await response.json();

      // Por ahora usamos mock data filtrada
      const filtered = tutoresDestacados.filter(
        (t) => t.skill.toLowerCase().includes(skill.toLowerCase())
      );
      setTutores(filtered);
    } catch (error) {
      console.error('Error fetching tutores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Navegar a resultados si hay query
    if (query.trim()) {
      router.push({
        pathname: '/search/profileresult',
        params: { query, filters: JSON.stringify(filters) },
      });
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleViewProfile = (tutorId: number, tutorName: string) => {
    // Navegar al perfil del tutor
    router.push({
      pathname: '/search/profileresult',
      params: { tutorId, tutorName },
    });
  };

  const renderTutorCard = (tutor: Tutor) => (
    <TutorCard
      key={tutor.userId}
      id={tutor.userId}
      name={tutor.name}
      skill={tutor.skill}
      rating={tutor.rating || 'Bronce'}
      costPerSession={tutor.costPerSession}
      onViewProfile={handleViewProfile}
    />
  );

  const renderCategories = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Categorías Populares</Text>
      <View style={styles.categoriesGrid}>
        {['React Native', 'Python', 'TypeScript', 'HTML/CSS'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={styles.categoryChip}
            onPress={() => {
              setSearchQuery(cat);
              handleSearch(cat);
            }}
          >
            <Ionicons name="bookmark" size={20} color="#ff743dff" />
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff743dff" />
        </View>
      ) : searchQuery.trim() ? (
        // Mostrar resultados de búsqueda
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              Resultados para "{searchQuery}"
            </Text>
            <Text style={styles.resultsCount}>
              {tutores.length} tutor{tutores.length !== 1 ? 'es' : ''} encontrado{tutores.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {tutores.length > 0 ? (
            tutores.map(renderTutorCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No se encontraron tutores para "{searchQuery}"
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Intenta con otra habilidad
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        // Mostrar tutores destacados y categorías
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {renderCategories()}

          <View style={styles.highlightedSection}>
            <Text style={styles.sectionTitle}>Tutores Destacados</Text>
            {tutoresDestacados.map(renderTutorCard)}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  content: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  resultsCount: {
    fontSize: 13,
    color: '#999',
  },

  categoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  categoryText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },

  highlightedSection: {
    paddingVertical: 12,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 60,
  },

  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },

  emptyStateSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});