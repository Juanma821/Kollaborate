import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getSaldoRequest, getHistorialRequest, loginDiarioRequest, type TransaccionItem } from '../../_utils/api';
import { getToken } from '../../_utils/authStorage';

export default function Token() {
  const [selectedTab, setSelectedTab] = useState<'received' | 'transferred'>('received');
  const [saldo, setSaldo] = useState<number>(0);
  const [historial, setHistorial] = useState<TransaccionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [streakDias, setStreakDias] = useState(0);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const [saldoData, historialData] = await Promise.all([
        getSaldoRequest(token),
        getHistorialRequest(token),
      ]);

      console.log('saldoData:', JSON.stringify(saldoData));
      setSaldo(saldoData.saldo);
      setStreakDias(saldoData.streakDias);
      setHistorial(historialData);
    } catch (error) {
      console.error('Error cargando tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginDiario = async () => {
    try {
      setLoadingLogin(true);
      const token = await getToken();
      if (!token) return;

      const result = await loginDiarioRequest(token);

      if (result.tokensGanados === 0) {
        Alert.alert('ℹ️ Ya reclamaste hoy', result.mensaje);
      } else {
        Alert.alert(
          result.bonusStreak ? '🔥 ¡Bonus Streak!' : '✅ Recompensa diaria',
          result.mensaje
        );
        await loadData();
      }

      setStreakDias(result.streakDias);
    } catch (error) {
      Alert.alert('Error', 'No se pudo reclamar la recompensa');
    } finally {
      setLoadingLogin(false);
    }
  };

const historialFiltrado = historial.filter(item => {
  const tipoNormalizado = item.tipo?.toLowerCase();
  
  return selectedTab === 'received' 
    ? tipoNormalizado === 'ingreso' 
    : tipoNormalizado === 'egreso';
});

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const formatConcepto = (concepto: string) => {
    const map: Record<string, string> = {
      'login_diario': '🎁 Login diario',
      'bonus_streak_7dias': '🔥 Bonus streak 7 días',
      'sesion_completada': '✅ Sesión completada',
      'pago_sesion': '📚 Pago de sesión',
    };
    return map[concepto] || concepto;
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>

      {/* Saldo */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo Actual</Text>
        <Text style={styles.balanceAmount}>
          {saldo.toLocaleString('es-CL')} Tokens
        </Text>

        {/* Streak */}
        <View style={styles.streakRow}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Ionicons
              key={i}
              name="flame"
              size={20}
              color={i < streakDias ? '#ff743d' : '#ddd'}
            />
          ))}
          <Text style={styles.streakText}>{streakDias}/7 días</Text>
        </View>

        {/* Botón login diario */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLoginDiario}
          disabled={loadingLogin}
        >
          {loadingLogin
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.loginBtnText}>🎁 Reclamar recompensa diaria</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Tabs */}
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

      {/* Historial */}
      <View style={globalStyles.contentSectionB}>
        <Text style={globalStyles.sectionTitle}>
          {selectedTab === 'received' ? 'Tokens recibidos' : 'Tokens enviados'}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {historialFiltrado.length > 0 ? (
              historialFiltrado.map(item => (
                <View key={item.id} style={globalStyles.listItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={globalStyles.itemDescription}>
                      {formatConcepto(item.concepto)}
                    </Text>
                    <Text style={globalStyles.itemDate}>
                      {item.tipo === 'ingreso'
                        ? `De: ${item.emisor}`
                        : `Para: ${item.receptor}`}
                    </Text>
                    <Text style={globalStyles.itemDate}>{formatFecha(item.fecha)}</Text>
                  </View>
                  <Text style={[
                    styles.itemAmount,
                    item.tipo === 'ingreso' ? globalStyles.positiveAmount : globalStyles.negativeAmount
                  ]}>
                    {item.tipo === 'ingreso' ? '+' : '-'}{item.monto}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="wallet-outline" size={60} color="#ccc" />
                <Text style={{ color: '#999', marginTop: 10 }}>
                  No hay movimientos registrados
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceContainer: {
    paddingVertical: 25,
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
    gap: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.textBalance,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
});