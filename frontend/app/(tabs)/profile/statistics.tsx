import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; //Install

export default function Statistics() {
   const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 20 }]}>

      {/* Sección Grafica 1 Mis estadisticas*/}
      <Text style={styles.estadisticasLabel}>Resumen</Text>      
      <View style={styles.estadisticasContainer}>
        <Text style={styles.estadisticasAmount}>Reputación Promedio:</Text>
        <Text style={styles.estadisticasAmount}>Tokens Actuales:</Text>
        <Text style={styles.estadisticasAmount}>Rango:</Text>
      </View>     

      {/* Sección Grafica 2 Aprendizaje/Enseñanza */}     
      <View style={styles.balanceAprendizajeEnseñanzaContainer}>
        <Text style={styles.balanceLabel}>Grafico Aprendizaje/Enseñanza</Text>
      </View> 

      {/* Sección Grafica 3 Reputación */}     
      <View style={styles.balanceReputaciónContainer}>
        <Text style={styles.balanceLabel}>Grafico Reputación</Text>
      </View>    

      {/* Sección Grafica 4 Tokens */}     
      <View style={styles.balanceTokensContainer}>
        <Text style={styles.balanceLabel}>Grafico Tokens</Text>
      </View>    

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },

  // Estilo Container Mis Estadisticas
  estadisticasContainer: {
    paddingVertical: 50,
    backgroundColor: '#8ba5fa',
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  estadisticasLabel: {
    fontSize: 24,
    color: '#2c2525',
    marginTop:-20,
    marginBottom: 10,
    textAlign: 'center',
  },
  estadisticasAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'auto',
    marginLeft: 25,
  },

   // Estilo Container Aprendizaje/Enseñanza
  balanceAprendizajeEnseñanzaContainer: {
    paddingVertical: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8ba5fa',
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Estilo Container Reputación
  balanceReputaciónContainer: {
    paddingVertical: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8ba5fa',
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Estilo Container Tokens
  balanceTokensContainer: {
    paddingVertical: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8ba5fa',
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

// Estilo que debo actualizar para cada grafico, por ahora es el mismo
  balanceLabel: {
    fontSize: 26,
    color: '#2c2525',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});