import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { PieChart, LineChart } from "react-native-chart-kit";
import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get("window").width;

export default function Statistics() {
  const insets = useSafeAreaInsets();

  // Datos de ejemplo
  const dataPie = [
    { name: "Aprendiz", population: 12, color: Colors.primary, legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Mentor", population: 8, color: "#4CAF50", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  ];

  return (
    <ScrollView contentContainerStyle={[globalStyles.scrollContainer, { paddingTop: insets.top + 20 }]}>
      
      <Text style={styles.estadisticasLabel}>Mi Resumen</Text>
      
      {/* Tarjeta */}
      <View style={styles.estadisticasContainer}>
        <View style={styles.row}>
            <Text style={styles.estadisticasAmount}>⭐ Reputación:</Text>
            <Text style={styles.dataValue}>4.5</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.estadisticasAmount}>🪙 Tokens:</Text>
            <Text style={styles.dataValue}>120</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.estadisticasAmount}>🏆 Rango:</Text>
            <Text style={[styles.dataValue, {color: Colors.primary}]}>Plata</Text>
        </View>
      </View>

      {/* Gráfico 1*/}
      <View style={globalStyles.statisticsCard}>
        <Text style={styles.balanceLabel}>Balance de Actividad</Text>
        <PieChart
          data={dataPie}
          width={screenWidth - 60}
          height={200}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>

      {/* Gráfico 2 */}
      <View style={globalStyles.statisticsCard}>
        <Text style={styles.balanceLabel}>Evolución de Tokens</Text>
        <LineChart
          data={{
            labels: ["Ene", "Feb", "Mar", "Abr"],
            datasets: [{ data: [50, 70, 40, 120] }]
          }}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(106, 76, 147, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2, 
};

const styles = StyleSheet.create({
  estadisticasContainer: {
    padding: 20,
    backgroundColor: Colors.colorCard || '#fff',
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
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  estadisticasLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 15,
    textAlign: 'center',
  },
  estadisticasAmount: {
    fontSize: 16,
    color: '#666',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
});