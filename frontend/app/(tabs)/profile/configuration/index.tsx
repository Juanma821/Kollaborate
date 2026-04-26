import React, { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';

import { Colors } from '../../../../assets/images/constants/Colors';
import { globalStyles } from '../../../../assets/images/constants/globalStyles';

import * as SecureStore from 'expo-secure-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; //install
import Feather from '@expo/vector-icons/Feather'; //install
import Ionicons from '@expo/vector-icons/Ionicons'; //install


export default function Configuration() {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  // Estados para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cerrar sesión
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          style: "destructive",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('userToken'); //ojo
              await SecureStore.deleteItemAsync('userData');
              router.replace('/login');

            } catch (error) {
              console.error("Error al cerrar sesión:", error);
              Alert.alert("Error", "No se pudo cerrar la sesión correctamente.");
            }
          }
        }
      ]
    );
  };

  // Limpiar Modal
  const resetModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  // Cambiar Contraseña
  const handleUpdatePassword = async () => {
    setErrorMessage(''); // Limpiamos errores

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      // Token
      const token = await SecureStore.getItemAsync('userToken');

      const response = await fetch('http://localhost:3000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        // ÉXITO
        Alert.alert("¡Éxito!", "Tu contraseña ha sido actualizada correctamente.");
        setModalVisible(false);
        resetModal();
      } else {
        // ERROR
        setErrorMessage(data.error || "Error al actualizar");
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorMessage("No se pudo conectar con el servidor.");
    }
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

    {/* Opción para abrir el Modal */}
    <TouchableOpacity style={styles.settingItem} onPress={() => setModalVisible(true)}>
      <Text style={styles.settingLabel}>Cambiar contraseña</Text>
      <Feather name="lock" size={20} color="#ccc" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/(tabs)/profile/configuration/report')}>
      <Text style={styles.settingLabel}>Reportar un problema</Text>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={[styles.settingLabel, { color: 'red', fontWeight: 'bold' }]}>Cerrar Sesión</Text>
      <Feather name="log-out" size={28} color="red" />
    </TouchableOpacity>

    {/* MODAL DE CAMBIO DE CONTRASEÑA */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={[globalStyles.modalOverlay, { alignItems: 'center' }]}>
        <View style={styles.modalView}>
          <Text style={[globalStyles.modalTitle, { textAlign: 'center', marginBottom: 20, }]}>Cambiar Contraseña</Text>

          <Text style={globalStyles.label}>Contraseña Actual</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <Text style={globalStyles.label}>Nueva Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={globalStyles.label}>Confirmar Nueva Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* MENSAJE DE ERROR */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color="red" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* BOTONES DEL MODAL */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => {
                setModalVisible(false)
                resetModal();
              }}
            >
              <Text style={globalStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm, (!currentPassword || !newPassword || !confirmPassword) && styles.buttonConfirmDisabled]}
              onPress={handleUpdatePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              <Text style={globalStyles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

  </ScrollView>
);
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  settingLabel: {
    fontSize: 18
  },
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
  // ESTILOS DEL MODAL
  modalView: {
    width: '90%',
    backgroundColor: Colors.whiteBg,
    borderRadius: 20,
    padding: 35,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: Colors.error,
  },
  buttonConfirm: {
    backgroundColor: Colors.success,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe5e5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginLeft: 5,
  },
  // Opcional: Botón desactivado
  buttonConfirmDisabled: {
    backgroundColor: '#A0A0A0',
  }
});