import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Sección Saldo Actual */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo Actual</Text>
        <Text style={styles.balanceAmount}>1,250 Tokens</Text>
      </View>

      {/* Seccion Boton Recibido/Enviado */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[styles.selectorButton, selectedTab === 'received' && styles.selectorButtonActive]}
          onPress={() => setSelectedTab('received')}
        >
          <Text style={[styles.selectorText, selectedTab === 'received' && styles.selectorTextActive]}>
            Recibido
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.selectorButton, selectedTab === 'transferred' && styles.selectorButtonActive]}
          onPress={() => setSelectedTab('transferred')}
        >
          <Text style={[styles.selectorText, selectedTab === 'transferred' && styles.selectorTextActive]}>
            Enviado
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección Contenido Datos Transferencia */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>
          {selectedTab === 'received' ? 'Transferencias recibidas' : 'Transferencias enviadas'}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {currentData.map(item => (
            <View key={item.id} style={styles.listItem}>
              <View>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
              <Text style={[
                styles.itemAmount,
                selectedTab === 'received' ? styles.positiveAmount : styles.negativeAmount
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

// Estilo Backgroud y Contenedores
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Estilo Container Saldo Actual
  balanceContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8ba5fa',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#2c2525',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
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

  //Estilo Contenido Datos Transferencia
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
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveAmount: { color: '#4caf50' },
  negativeAmount: { color: '#f44336' },
  itemDescription: { fontSize: 15, color: '#333' },
  itemDate: { fontSize: 12, color: '#aaa', marginTop: 2 }
});