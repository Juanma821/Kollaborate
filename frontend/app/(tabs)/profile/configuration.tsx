import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; //install
import Feather from '@expo/vector-icons/Feather'; //install

export default function Configuration() {
  const insets = useSafeAreaInsets();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    
    const handleLogout = () => {
      alert("Simulación: Sesión cerrada");
    };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top + 5 }]}>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Modo oscuro</Text>
        <Switch
          value={isDarkMode}
          onValueChange={(value) => setIsDarkMode(value)}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notificaciones</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={(value) => setIsNotificationsEnabled(value)}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.settingLabel}>Cerrar Sesión</Text>
        <Feather name="log-out" size={28} color="red"  />
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilo Backgroud y Contenedores
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    padding: 20 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    marginTop: 40 
  },
// Estilo Opciones de Configuración
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingLabel: { 
    fontSize: 18 
  },
  footer: { 
    textAlign: 'center', 
    marginTop: 30, 
    color: '#888' 
  },

// Estilo Opcion Cerrar Sesión
  logoutButton: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffe5e5',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
});