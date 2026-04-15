import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { Ionicons } from '@expo/vector-icons'; //install
import { useSafeAreaInsets } from 'react-native-safe-area-context'; //install

export default function Skills() {
const insets = useSafeAreaInsets();
  const [ofrezco, setOfrezco] = useState(['React Native', 'Diseño UI']);
  const [busco, setBusco] = useState(['Node.js', 'Inglés']);
  const [inputOfrezco, setInputOfrezco] = useState('');
  const [inputBusco, setInputBusco] = useState('');

  // Función para añadir
  const addSkill = (type: 'ofrezco' | 'busco') => {
    if (type === 'ofrezco' && inputOfrezco.trim()) {
      setOfrezco([...ofrezco, inputOfrezco.trim()]);
      setInputOfrezco('');
    } else if (type === 'busco' && inputBusco.trim()) {
      setBusco([...busco, inputBusco.trim()]);
      setInputBusco('');
    }
  };

  // Función para quitar
  const removeSkill = (skillToRemove: string, type: 'ofrezco' | 'busco') => {
    if (type === 'ofrezco') {
      setOfrezco(ofrezco.filter(skill => skill !== skillToRemove));
    } else {
      setBusco(busco.filter(skill => skill !== skillToRemove));
    }
  };

  const SkillTag = ({ name, onRemove }: { name: string, onRemove: () => void }) => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{name}</Text>
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="close-circle" size={18} color="#ff743dff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}>

        {/* SECCIÓN: BRINDO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades que brindo</Text>
          <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Python, Oratoria..." 
              value={inputOfrezco}
              onChangeText={setInputOfrezco}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => addSkill('ofrezco')}>
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {ofrezco.map(skill => (
              <SkillTag key={skill} name={skill} onRemove={() => removeSkill(skill, 'ofrezco')} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* SECCIÓN: BUSCO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades que busco</Text>
          <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Matemáticas, Guitarra..." 
              value={inputBusco}
              onChangeText={setInputBusco}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => addSkill('busco')}>
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {busco.map(skill => (
              <SkillTag key={skill} name={skill} onRemove={() => removeSkill(skill, 'busco')} />
            ))}
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilo Backgroud y Contenedores
const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 20, 
    paddingBottom: 40, 
    backgroundColor: '#fff' 
  },
  mainTitle: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 25, 
    color: '#333' 
  },
  section: { 
    marginBottom: 30 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#666', 
    marginBottom: 10 
  },
  inputRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginBottom: 15 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 12, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#e0e0e0' 
  },
// Estilo Botón Añadir Habilidad
  addButton: { 
    backgroundColor: '#ff743dff', 
    padding: 10, 
    borderRadius: 10, 
    justifyContent: 'center' 
  },

// Estilo Tags de Habilidades
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
    borderColor: '#ff743dff',
    gap: 8
  },
  tagText: { 
    color: '#333', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#f0f0f0', 
    marginBottom: 30 
  }
});