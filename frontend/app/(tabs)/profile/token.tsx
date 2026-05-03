import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTokensRequest } from '../../_utils/api';
import { getToken } from '../../_utils/authStorage';

interface TransferItem {
  id: number;
  description: string;
  amount: string;
  date: string;
}

export default function Token() {
  const [selectedTab, setSelectedTab] = useState<'received' | 'transferred'>('received');
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<TransferItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadTokenData();
  }, [selectedTab]);

  const loadTokenData = async () => {
    try {
      setLoading(true);
      const userToken = await getToken();
      if (userToken) {
        const data = await getTokensRequest(userToken, selectedTab);
        setBalance(data.balance);
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Error cargando datos de billetera:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      
      {/* Sección Saldo Actual Dinámico */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo Actual</Text>
        <Text style={styles.balanceAmount}>
          {balance.toLocaleString('es-CL')} Tokens
        </Text>
      </View>

      {/* Selector de Pestañas */}
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

      {/* Sección Historial */}
      <View style={globalStyles.contentSectionB}>
        <Text style={globalStyles.sectionTitle}>
          {selectedTab === 'received' ? 'Transferencias recibidas' : 'Transferencias enviadas'}
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary || "#0000ff"} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {history.length > 0 ? (
              history.map(item => (
                <View key={item.id} style={globalStyles.listItem}>
                  <View style={{ flex: 1 }}>
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
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 30, color: 'gray' }}>
                No hay movimientos registrados.
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.colorCard,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
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
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});