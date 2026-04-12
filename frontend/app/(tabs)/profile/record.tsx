import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Record() {
  const [selectedTab, setSelectedTab] = useState('day'); 
  const insets = useSafeAreaInsets();

  // Datos de ejemplo para probar pestañas
  const dayData = [
    { id: 1, description: 'Aprendizaje', date: '2026-04-03' },
  ];
  const monthData = [
    { id: 1, description: 'Aprendizaje', date: '2026-04-03' },
    { id: 2, description: 'Enseñanza', date: '2026-04-01' },
  ];

  const yearData = [
    { id: 1, description: 'Aprendizaje', date: '2026-04-03' },
    { id: 2, description: 'Enseñanza', date: '2026-04-01' },
    { id: 3, description: 'Enseñanza', date: '2026-02-07' },
  ]

  const currentData = selectedTab === 'day' ? dayData : selectedTab === 'month' ? monthData : yearData;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Seccion Botones Dia, Mes y Año */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[styles.selectorButton, selectedTab === 'day' && styles.selectorButtonActive]}
          onPress={() => setSelectedTab('day')}
        >
          <Text style={[styles.selectorText, selectedTab === 'day' && styles.selectorTextActive]}>
            Día
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.selectorButton, selectedTab === 'month' && styles.selectorButtonActive]}
          onPress={() => setSelectedTab('month')}
        >
          <Text style={[styles.selectorText, selectedTab === 'month' && styles.selectorTextActive]}>
            Mes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.selectorButton, selectedTab === 'year' && styles.selectorButtonActive]}
          onPress={() => setSelectedTab('year')}
        >
          <Text style={[styles.selectorText, selectedTab === 'year' && styles.selectorTextActive]}>
            Año
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección Contenido Datos Transferencia */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>
          {selectedTab === 'day' ? 'Actividades' : selectedTab === 'month' ? 'Actividades' : 'Actividades'}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {currentData.map(item => (
            <View key={item.id} style={styles.listItem}>
              <View>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// Estilo Backgroud y Contenedores
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Estilo Container Botones
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: 'rgb(61, 106, 255)',
  },
  selectorText: {
    fontWeight: '600',
    color: '#666',
  },
  selectorTextActive: {
    color: '#fff',
  },

  //Estilo Contenido Datos dia, mes y año
  contentSection: {
    flex: 1,
    marginTop: 25,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemDescription: { fontSize: 15, color: '#333' },
  itemDate: { fontSize: 12, color: '#aaa', marginTop: 2 }
});