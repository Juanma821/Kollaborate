import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; //Install

export default function Token() {
  const [selectedTab, setSelectedTab] = useState('received'); 
  const insets = useSafeAreaInsets();

  // Datos de ejemplo para probar pestañas
  const receivedData = [
    { id: 1, description: 'Recibido de Pedro', amount: '+100 tokens', date: '2024-01-15' },
    { id: 2, description: 'Recibido de Ana', amount: '+50 tokens', date: '2024-01-14' },
  ];
  const transferredData = [
    { id: 1, description: 'Transferencia a Juan', amount: '-50 tokens', date: '2024-01-15' },
  ];

  const currentData = selectedTab === 'received' ? receivedData : transferredData;

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      
      {/* Sección Saldo Actual */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo Actual</Text>
        <Text style={styles.balanceAmount}>1,250 Tokens</Text>
      </View>

      {/* Seccion Boton Recibido/Enviado */}
      <View style={globalStyles.selectorContainer}>
        <TouchableOpacity
          style={[globalStyles.selectorButton, selectedTab === 'received' && globalStyles.selectorButtonActive]}
          onPress={() => setSelectedTab('received')}
        >
          <Text style={[globalStyles.selectorText, selectedTab === 'received' && globalStyles.selectorTextActive]}>
            Recibido
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[globalStyles.selectorButton, selectedTab === 'transferred' && globalStyles.selectorButtonActive]}
          onPress={() => setSelectedTab('transferred')}
        >
          <Text style={[globalStyles.selectorText, selectedTab === 'transferred' && globalStyles.selectorTextActive]}>
            Enviado
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección Contenido Datos Transferencia */}
      <View style={globalStyles.contentSectionB}>
        <Text style={globalStyles.sectionTitle}>
          {selectedTab === 'received' ? 'Transferencias recibidas' : 'Transferencias enviadas'}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {currentData.map(item => (
            <View key={item.id} style={globalStyles.listItem}>
              <View>
                <Text style={globalStyles.itemDescription}>{item.description}</Text>
                <Text style={globalStyles.itemDate}>{item.date}</Text>
              </View>
              <Text style={[
                styles.itemAmount,
                selectedTab === 'received' ? globalStyles.positiveAmount : globalStyles.negativeAmount
              ]}>
                {item.amount}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// Estilos Propios
const styles = StyleSheet.create({
  // Estilo Container Saldo Actual
  balanceContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.colorCard,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.textBalance,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  //Estilo Contenido Datos Transferencia
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});