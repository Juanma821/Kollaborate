import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart, LineChart } from "react-native-chart-kit";
import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getToken } from '../../_utils/authStorage';
import { getStatisticsRequest, type UserStatistics } from '../../_utils/api';
import Ionicons from '@expo/vector-icons/Ionicons';

const screenWidth = Dimensions.get("window").width;

export default function Statistics() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (token) {
        const data = await getStatisticsRequest(token);
        setStats(data);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.containerApp, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Datos Gráficos redondo
  const pieData = [
    {
      name: "Aprendiz",
      population: stats?.balance.aprendizaje || 0,
      color: Colors.primary,
      legendFontColor: Colors.textDark,
      legendFontSize: 12
    },
    {
      name: "Mentor",
      population: stats?.balance.ensenanza || 0,
      color: Colors.confirmBg,
      legendFontColor: Colors.textDark,
      legendFontSize: 12
    }
  ];

  const lineData = {
    labels: stats?.historial.map(h => h.label) || ["-"],
    datasets: [{
      data: stats?.historial.map(h => h.valor) || [0]
    }]
  };

  return (
    <ScrollView contentContainerStyle={[globalStyles.scrollContainer, { paddingTop: insets.top + 5 }]}>

      <Text style={styles.title}>Resumen</Text>

      {/* Tarjeta*/}
      <View style={styles.estadisticasContainer}>
        <Text style={styles.estadisticasAmount}>⭐ Reputación: {stats?.resumen.reputacion.toFixed(1) || '0.0'}</Text>
        <Text style={styles.estadisticasAmount}>🪙 Tokens Actuales: {stats?.resumen.tokens || '0'}</Text>
        <Text style={[styles.estadisticasAmount, { color: stats?.resumen.rango_color || Colors.textDark }]}>
          🏆 Rango: {stats?.resumen.rango || 'Sin Rango'}
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.title}>Balance de Actividad</Text>
      {/* Grafico 1 */}
      <View style={globalStyles.statisticsCard}>
        <PieChart
          data={pieData}
          width={screenWidth - 60}
          height={200}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>

      <View style={styles.divider} />

      <Text style={styles.title}>Tendencia de Tokens</Text>
      {/* Grafico 2 */}
      <View style={globalStyles.statisticsCard}>

        {stats?.historial && stats.historial.length > 0 ? (
          <LineChart
            data={{
              labels: stats.historial.map(h => h.label),
              datasets: [{ data: stats.historial.map(h => h.valor) }]
            }}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        ) : (
          <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="stats-chart-outline" size={40} color={Colors.textDark} />
            <Text style={{ color: Colors.textDark, marginTop: 10 }}>Sin movimientos recientes de tokens</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: Colors.whiteBg,
  backgroundGradientFrom: Colors.whiteBg,
  backgroundGradientTo: Colors.whiteBg,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(106, 76, 147, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: Colors.primary }
};

const styles = StyleSheet.create({
  estadisticasContainer: {
    padding:20,
    backgroundColor: Colors.card || '#fff',
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 5,
  },
  estadisticasAmount: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: 'bold',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDarked,
    marginVertical: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10,
    color: Colors.TextprimaryDark,
    textAlign: 'center'
  },

});