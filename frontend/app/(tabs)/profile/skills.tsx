import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../_utils/api';
import { getToken } from '../../_utils/authStorage';

interface Skill {
  id: number;
  nombre: string;
  tipo?: 'Ofrece' | 'Busca';
}

type CategoriaMap = Record<string, Skill[]>;

const normalizar = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Skills() {
  const insets = useSafeAreaInsets();

  const [ofrezco, setOfrezco] = useState<Skill[]>([]);
  const [busco, setBusco] = useState<Skill[]>([]);

  const [inputOfrezco, setInputOfrezco] = useState('');
  const [inputBusco, setInputBusco] = useState('');

  const [activeInput, setActiveInput] = useState<'ofrezco' | 'busco' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [categorias, setCategorias] = useState<CategoriaMap>({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Skill[]>([]);

  useEffect(() => {
    fetchUserSkills();
    fetchCategorias();
  }, []);

const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/skills/by-categoria`);
      if (!response.ok) throw new Error('Fallo en API Categorias');
      
      const data = await response.json();
      
      setCategorias(data && typeof data === 'object' ? data : {});
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategorias({});
    }
  };

  const fetchUserSkills = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/skills/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setOfrezco([]);
        setBusco([]);
        return;
      }

      const data = await response.json();
    
      const data_to_filter = Array.isArray(data) ? data : [];

      setOfrezco(data_to_filter.filter((s: Skill) => s.tipo === 'Ofrece'));
      setBusco(data_to_filter.filter((s: Skill) => s.tipo === 'Busca'));
    } catch (error) {
      console.error('Error en fetchUserSkills:', error);
      setOfrezco([]);
      setBusco([]);
    }
  };

  const handleInputChange = (text: string, type: 'ofrezco' | 'busco') => {
    if (type === 'ofrezco') setInputOfrezco(text);
    else setInputBusco(text);

    setActiveInput(type);
    setCategoriaSeleccionada(null);

    if (text.trim().length > 1) {
      buscarPorTexto(text);
    } else {
      setSuggestions([]);
    }
  };

  const buscarPorTexto = async (texto: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/skills/search?q=${encodeURIComponent(texto)}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error buscando:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const seleccionarCategoria = (cat: string) => {
    setCategoriaSeleccionada(cat);
    setSuggestions(categorias[cat] || []);
  };

  const handleFocus = (type: 'ofrezco' | 'busco') => {
    setActiveInput(type);
    setCategoriaSeleccionada(null);
    setSuggestions([]);
    if (type === 'ofrezco') setInputOfrezco('');
    else setInputBusco('');
  };

  const addSkill = async (skill: Skill, type: 'ofrezco' | 'busco') => {
    const listaActual = type === 'ofrezco' ? ofrezco : busco;
    if (listaActual.find((s) => s.id === skill.id)) {
      Alert.alert('Ya agregada', `"${skill.nombre}" ya está en tu lista.`);
      return;
    }

    try {
      const token = await getToken();
      if (!token) return;

      const accion = type === 'ofrezco' ? 'offer' : 'want';
      const response = await fetch(`${API_BASE_URL}/skills/${skill.id}/${accion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (type === 'ofrezco') {
          setOfrezco([...ofrezco, { ...skill, tipo: 'Ofrece' }]);
          setInputOfrezco('');
        } else {
          setBusco([...busco, { ...skill, tipo: 'Busca' }]);
          setInputBusco('');
        }
        setSuggestions([]);
        setCategoriaSeleccionada(null);
        setActiveInput(null);
      } else {
        Alert.alert('Aviso', data?.error || 'No se pudo añadir');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión al guardar');
    }
  };

  const removeSkill = async (skillId: number, type: 'ofrezco' | 'busco') => {
    try {
      const token = await getToken();
      if (!token) return;

      const accion = type === 'ofrezco' ? 'offer' : 'want';
      const response = await fetch(`${API_BASE_URL}/skills/${skillId}/${accion}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        if (type === 'ofrezco') setOfrezco(ofrezco.filter((s) => s.id !== skillId));
        else setBusco(busco.filter((s) => s.id !== skillId));
      } else {
        Alert.alert('Error', 'No se pudo eliminar');
      }
    } catch {
      Alert.alert('Error', 'Error de conexión al eliminar');
    }
  };

  const SkillTag = ({ skill, type }: { skill: Skill; type: 'ofrezco' | 'busco' }) => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{skill.nombre}</Text>
      <TouchableOpacity onPress={() => removeSkill(skill.id, type)}>
        <Ionicons name="close-circle" size={18} color="#ff743dff" />
      </TouchableOpacity>
    </View>
  );

  const renderPanel = (type: 'ofrezco' | 'busco') => {
    const inputValue = type === 'ofrezco' ? inputOfrezco : inputBusco;
    const isActive = activeInput === type;
    const lista = type === 'ofrezco' ? ofrezco : busco;

    return (
      <View style={[styles.section, { zIndex: isActive ? 10 : 1 }]}>
        <Text style={[styles.sectionTitle, {color: Colors.TextprimaryDark}]}>
          {type === 'ofrezco' ? 'Habilidades que brindo' : 'Habilidades que busco'}
        </Text>

        <TextInput
          style={[globalStyles.input, { padding: 12 }]}
          placeholder="Toca para buscar o escribe..."
          value={inputValue}
          onFocus={() => handleFocus(type)}
          onChangeText={(text) => handleInputChange(text, type)}
        />

        {isActive && (
          <View style={styles.panel}>
            {!categoriaSeleccionada && inputValue.trim().length <= 1 && (
              <>
                <Text style={styles.panelLabel}>Categorías</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasRow}>
                  {Object.keys(categorias).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.categoriaChip}
                      onPress={() => seleccionarCategoria(cat)}
                    >
                      <Text style={styles.categoriaChipText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {categoriaSeleccionada && (
              <TouchableOpacity
                style={styles.breadcrumb}
                onPress={() => { setCategoriaSeleccionada(null); setSuggestions([]); }}
              >
                <Ionicons name="arrow-back" size={14} color={Colors.primary} />
                <Text style={styles.breadcrumbText}>{categoriaSeleccionada}</Text>
              </TouchableOpacity>
            )}

            {isLoading ? (
              <Text style={styles.loadingText}>Buscando...</Text>
            ) : suggestions.length > 0 ? (
              <ScrollView style={styles.suggestionsContainer} nestedScrollEnabled>
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestionItem}
                    onPress={() => addSkill(item, type)}
                  >
                    <Text style={styles.suggestionText}>{item.nombre}</Text>
                    <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : inputValue.trim().length > 1 ? (
              <Text style={styles.loadingText}>Sin resultados</Text>
            ) : null}
          </View>
        )}

        <View style={styles.tagContainer}>
          {lista.map((skill) => (
            <SkillTag key={skill.id} skill={skill} type={type} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        {renderPanel('ofrezco')}
        <View style={styles.divider} />
        {renderPanel('busco')}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: Colors.card,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 10,
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  panelLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  categoriasRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoriaChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoriaChipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  breadcrumbText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  suggestionsContainer: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 15,
    color: '#333',
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    padding: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  tagText: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 30,
  },
});