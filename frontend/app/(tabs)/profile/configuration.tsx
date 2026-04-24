import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

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
    <ScrollView style={[globalStyles.containerApp, { padding: 20, paddingTop: insets.top + 5 }]}>
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

// Estilos Propios
const styles = StyleSheet.create({
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