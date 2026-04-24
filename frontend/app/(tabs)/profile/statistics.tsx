import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; //Install

export default function Statistics() {
   const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[globalStyles.scrollContainer, { paddingTop: insets.top + 20 }]}>

      {/* Sección Grafica 1 Mis estadisticas*/}
      <Text style={styles.estadisticasLabel}>Resumen</Text>      
      <View style={styles.estadisticasContainer}>
        <Text style={styles.estadisticasAmount}>Reputación Promedio:</Text>
        <Text style={styles.estadisticasAmount}>Tokens Actuales:</Text>
        <Text style={styles.estadisticasAmount}>Rango:</Text>
      </View>     

      {/* Sección Grafica 2 Aprendizaje/Enseñanza */}     
      <View style={globalStyles.statisticsCard}>
        <Text style={styles.balanceLabel}>Grafico Aprendizaje/Enseñanza</Text>
      </View> 

      {/* Sección Grafica 3 Reputación */}     
      <View style={globalStyles.statisticsCard}>
        <Text style={styles.balanceLabel}>Grafico Reputación</Text>
      </View>    

      {/* Sección Grafica 4 Tokens */}     
      <View style={globalStyles.statisticsCard}>
        <Text style={styles.balanceLabel}>Grafico Tokens</Text>
      </View>    

    </ScrollView>
  );
}

// Estilos Propios
const styles = StyleSheet.create({
  //Container Mis Estadisticas
  estadisticasContainer: {
    paddingVertical: 50,
    backgroundColor: Colors.colorCard,
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  estadisticasLabel: {
    fontSize: 24,
    color: Colors.textBalance,
    marginTop:-20,
    marginBottom: 10,
    textAlign: 'center',
  },
  estadisticasAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'auto',
    marginLeft: 25,
  },
// Estilo que debo actualizar para cada grafico, por ahora es el mismo
  balanceLabel: {
    fontSize: 26,
    color: Colors.textBalance,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
});