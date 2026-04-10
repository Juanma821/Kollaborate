import { Link, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function Profile() {
  const insets = useSafeAreaInsets();

  return (
    // Aplicamos el padding superior dinámicamente según el dispositivo
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Sección Saldo Actual */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Tarjeta Perfil</Text>
      </View>

      {/* Sección Opciones */}
      <View style={styles.contentSection}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/configuration')}>
          <Ionicons name="settings-sharp" size={30} color="black" />
           <Text>Ajustes</Text>
        </TouchableOpacity>  

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/skills')}>
          <Ionicons name="clipboard-sharp" size={24} color="black" />
           <Text>Habilidades</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/editprofile')}>
          <Feather name="edit" size={24} color="black" />
           <Text>Editar Perfil</Text>
        </TouchableOpacity> 

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/statistics')}>
         <Octicons name="goal" size={24} color="black" />
          <Text>Estadísticas</Text>
        </TouchableOpacity> 

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/record')}>
         <Fontisto name="history" size={24} color="black" />
          <Text>Historial</Text>
        </TouchableOpacity> 

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/token')}>
         <MaterialIcons name="generating-tokens" size={28} color="black" />
          <Text>Tokens</Text>
        </TouchableOpacity>
    
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
    paddingVertical: 120,
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

  //Estilo Contenido Opciones
  contentSection: {
    flexDirection: 'row', // Alinea en fila
    flexWrap: 'wrap',    // Permite que bajen a la siguiente fila
    justifyContent: 'center', // Centra el contenido horizontalmente
    alignItems: 'center',     // Centra el contenido verticalmente
    padding: 20,
  },
  iconButton: {
    width: '30%',        // Un poco menos del 33% para dejar espacio al margen
    aspectRatio: 1,      // Hace que el botón sea cuadrado
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',      // Pequeño espacio entre botones
    backgroundColor: '#fff', // Opcional: fondo para el botón
    borderRadius: 12,
  },
});