import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; //install

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
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      
      {/* Seccion Botones Dia, Mes y Año */}
      <View style={globalStyles.selectorContainer}>
        <TouchableOpacity
          style={[globalStyles.selectorButton, selectedTab === 'day' && globalStyles.selectorButtonActive]}
          onPress={() => setSelectedTab('day')}
        >
          <Text style={[globalStyles.selectorText, selectedTab === 'day' && globalStyles.selectorTextActive]}>
            Día
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[globalStyles.selectorButton, selectedTab === 'month' && globalStyles.selectorButtonActive]}
          onPress={() => setSelectedTab('month')}
        >
          <Text style={[globalStyles.selectorText, selectedTab === 'month' && globalStyles.selectorTextActive]}>
            Mes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[globalStyles.selectorButton, selectedTab === 'year' && globalStyles.selectorButtonActive]}
          onPress={() => setSelectedTab('year')}
        >
          <Text style={[globalStyles.selectorText, selectedTab === 'year' && globalStyles.selectorTextActive]}>
            Año
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección Contenido Datos Transferencia */}
      <View style={globalStyles.contentSectionB}>
        <Text style={globalStyles.sectionTitle}>
          {selectedTab === 'day' ? 'Actividades' : selectedTab === 'month' ? 'Actividades' : 'Actividades'}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {currentData.map(item => (
            <View key={item.id} style={globalStyles.listItem}>
              <View>
                <Text style={globalStyles.itemDescription}>{item.description}</Text>
                <Text style={globalStyles.itemDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
