import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { Ionicons } from '@expo/vector-icons'; //install
import { useSafeAreaInsets } from 'react-native-safe-area-context'; //install
import * as SecureStore from 'expo-secure-store'; //install

// Definición tipos
interface Skill {
  id: number;
  nombre: string;
}

export default function Skills() {
  const insets = useSafeAreaInsets();

  // Listas Skills Usuario
  const [ofrezco, setOfrezco] = useState<Skill[]>([]);
  const [busco, setBusco] = useState<Skill[]>([]);

  // Buscador
  const [inputOfrezco, setInputOfrezco] = useState('');
  const [inputBusco, setInputBusco] = useState('');
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [activeInput, setActiveInput] = useState<'ofrezco' | 'busco' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar habilidades
  useEffect(() => {
    fetchUserSkills();
  }, []);

  //Funciones
  const fetchUserSkills = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const url = 'http://localhost:3000/api/skills/user';

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const text = await response.text();

      if (!response.ok) {
        console.log("⚠️ Error en fetchUserSkills:", text);
        return;
      }

      const data = JSON.parse(text);

      setOfrezco(data.filter((s: any) => s.tipo === 'Ofrece'));
      setBusco(data.filter((s: any) => s.tipo === 'Busca'));

    } catch (error) {
      console.error("❌ Error en fetchUserSkills:", error);
    }
  };

  const handleSearch = async (text: string, type: 'ofrezco' | 'busco') => {
    type === 'ofrezco' ? setInputOfrezco(text) : setInputBusco(text);
    setActiveInput(type);

    if (text.trim().length > 1) {
      setIsLoading(true);
      try {
        const url = `http://localhost:3000/api/skills/search?q=${text}`;
        console.log("🔗 Intentando conectar a:", url);

        const response = await fetch(url);
        const resText = await response.text();
        console.log("📝 Respuesta del servidor:", resText);
        const data = JSON.parse(resText);
        setSuggestions(data);

      } catch (error) {
        console.error("❌ Error detallado:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const addSkillToDB = async (skill: Skill, type: 'ofrezco' | 'busco') => {
    const listaActual = type === 'ofrezco' ? ofrezco : busco;
    const yaExiste = listaActual.find(s => s.id === skill.id);

    if (yaExiste) {
      Alert.alert(
        "Habilidad duplicada",
        `Ya has añadido "${skill.nombre}" a tu lista de habilidades que ${type === 'ofrezco' ? 'ofreces' : 'buscas'}.`
      );
      // Limpiar buscador
      setSuggestions([]);
      setInputOfrezco('');
      setInputBusco('');
      setActiveInput(null);
      type === 'ofrezco' ? setInputOfrezco('') : setInputBusco('');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      const accion = type === 'ofrezco' ? 'offer' : 'want';
      const url = `http://localhost:3000/api/skills/${skill.id}/${accion}`;

      console.log("🚀 Intentando guardar en:", url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        if (type === 'ofrezco') {
          setOfrezco([...ofrezco, skill]);
          setInputOfrezco('');
        } else {
          setBusco([...busco, skill]);
          setInputBusco('');
        }
        setSuggestions([]);
        setActiveInput(null);
      } else {
        const err = await response.json();
        Alert.alert("Aviso", err.error || "No se pudo añadir");
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      Alert.alert("Error", "Error de conexión al guardar");
    }
  };

  const removeSkill = async (skillId: number, type: 'ofrezco' | 'busco') => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const accion = type === 'ofrezco' ? 'offer' : 'want';
      const url = `http://localhost:3000/api/skills/${skillId}/${accion}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        if (type === 'ofrezco') {
          setOfrezco(ofrezco.filter(s => s.id !== skillId));
        } else {
          setBusco(busco.filter(s => s.id !== skillId));
        }
      } else {
        Alert.alert("Error", "No se pudo eliminar de la base de datos");
        const errorData = await response.json();
        console.log("❌ Error del servidor al borrar:", errorData);
        Alert.alert("Error", errorData.error || "No se pudo eliminar");
      }
    } catch (error) {
      Alert.alert("Error", "Error de conexión al eliminar");
    }
  };

  const SkillTag = ({ skill, type }: { skill: Skill, type: 'ofrezco' | 'busco' }) => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{skill.nombre}</Text>
      <TouchableOpacity onPress={() => removeSkill(skill.id, type)}>
        <Ionicons name="close-circle" size={18} color="#ff743dff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
      >

        {/* SECCIÓN: Ofrezco */}
        <View style={[styles.section, { zIndex: activeInput === 'ofrezco' ? 10 : 1 }]}>
          <Text style={styles.sectionTitle}>Habilidades que brindo</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[globalStyles.input, { flex: 1, padding: 12 }]}
              placeholder="Escribe para buscar..."
              value={inputOfrezco}
              onChangeText={(text) => handleSearch(text, 'ofrezco')}
            />
          </View>

          {/* Sugerencias Ofrezco */}
          {activeInput === 'ofrezco' && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => addSkillToDB(item, 'ofrezco')}
                >
                  <Text style={styles.suggestionText}>{item.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.tagContainer}>
            {ofrezco.map(skill => (
              <SkillTag key={skill.id} skill={skill} type="ofrezco" />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* SECCIÓN: BUSCO */}
        <View style={[styles.section, { zIndex: activeInput === 'busco' ? 10 : 1 }]}>
          <Text style={styles.sectionTitle}>Habilidades que busco</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[globalStyles.input, { flex: 1, padding: 12 }]}
              placeholder="Escribe para buscar..."
              value={inputBusco}
              onChangeText={(text) => handleSearch(text, 'busco')}
            />
          </View>

          {/* Sugerencias Busco */}
          {activeInput === 'busco' && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => addSkillToDB(item, 'busco')}
                >
                  <Text style={styles.suggestionText}>{item.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.tagContainer}>
            {busco.map(skill => (
              <SkillTag key={skill.id} skill={skill} type="busco" />
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView >
  );
}

// Estilo Propios
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: Colors.card
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    color: Colors.textDark
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 10
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15
  },

  // Contenedor de Sugerencias
  suggestionsContainer: {
    position: 'absolute',
    top: 85, 
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999, 
    borderWidth: 1,
    borderColor: '#eee',
    maxHeight: 200, 
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },

  // Botón Añadir Habilidad
  addButton: {
    backgroundColor: Colors.colorCard,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center'
  },

  // Tags de Habilidades
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
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
    gap: 8
  },
  tagText: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '500'
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 30
  }
});