import React, { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';

import { Colors } from '../../../../assets/images/constants/Colors';
import { globalStyles } from '../../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import { changePasswordRequest } from '../../../_utils/api';
import { clearAuthSession, getToken } from '../../../_utils/authStorage';

export default function Configuration() {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const theme = {
    background: isDarkMode ? '#121212' : globalStyles.containerApp.backgroundColor || '#F5F5F5',
    surface: isDarkMode ? '#1E1E1E' : Colors.whiteBg,
    text: isDarkMode ? '#FFFFFF' : '#000000',
    border: isDarkMode ? '#333333' : Colors.borderDark,
    subtext: isDarkMode ? '#A0A0A0' : '#666666',
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleDarkMode = async (value: boolean) => {
    setIsDarkMode(value);
    await SecureStore.setItemAsync('darkMode', JSON.stringify(value));
  };

  const toggleNotifications = async (value: boolean) => {
    setIsNotificationsEnabled(value);
    await SecureStore.setItemAsync('notifications', JSON.stringify(value));
    if (value) {
      Alert.alert('Aviso', 'Has activado las notificaciones push.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesion',
      '¿Estas seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Si, salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAuthSession();
              router.replace('/login');
            } catch (error) {
              console.error('Error al cerrar sesion:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesion correctamente.');
            }
          }
        }
      ]
    );
  };

  const resetModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handleUpdatePassword = async () => {
    setErrorMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas nuevas no coinciden.');
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        setErrorMessage('No hay sesion activa.');
        return;
      }

      const data = await changePasswordRequest(token, currentPassword, newPassword);

      Alert.alert('Exito', data.message || 'Tu contraseña ha sido actualizada correctamente.');
      setModalVisible(false);
      resetModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo conectar con el servidor.';
      setErrorMessage(message);
    }
  };

  return (
    <ScrollView
      style={[
        globalStyles.containerApp,
        { padding: 20, paddingTop: insets.top + 5, backgroundColor: theme.background }
      ]}
    >
      <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>Modo oscuro (BETA)</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>Notificaciones</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.settingLabel, { color: theme.text }]}>Cambiar contraseña</Text>
        <Feather name="lock" size={20} color={theme.subtext} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={() => router.push('/(tabs)/profile/configuration/report')}
      >
        <Text style={[styles.settingLabel, { color: theme.text }]}>Reportar un problema</Text>
        <Ionicons name="chevron-forward" size={24} color={theme.subtext} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutButton, isDarkMode && { backgroundColor: '#441111', borderColor: '#661111' }]}
        onPress={handleLogout}
      >
        <Text style={[styles.settingLabel, { color: 'red', fontWeight: 'bold' }]}>Cerrar sesión</Text>
        <Feather name="log-out" size={28} color="red" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[globalStyles.modalOverlay,{alignItems: 'center',}]}>
          <View style={[styles.modalView, { backgroundColor: theme.surface }]}>
            <Text style={[globalStyles.modalTitle, { textAlign: 'center', marginBottom: 20, color: theme.text }]}>
              Cambiar contraseña
            </Text>

            <Text style={[globalStyles.label, { color: theme.text }]}>Contraseña actual</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor={theme.subtext}
            />

            <Text style={[globalStyles.label, { color: theme.text }]}>Nueva contraseña</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor={theme.subtext}
            />

            <Text style={[globalStyles.label, { color: theme.text }]}>Confirmar nueva contraseña</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor={theme.subtext}
            />

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color="red" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => { setModalVisible(false); resetModal(); }}
              >
                <Text style={globalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonConfirm,
                  (!currentPassword || !newPassword || !confirmPassword) && styles.buttonConfirmDisabled
                ]}
                onPress={handleUpdatePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                <Text style={globalStyles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={{ color: theme.subtext, textAlign: 'center', marginTop: 20, fontSize: 12 }}>
        Version 1.0.0 (Beta)
      </Text>
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
  modalView: {
    width: '90%',
    backgroundColor: Colors.whiteBg,
    borderRadius: 20,
    padding: 35,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
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
  buttonConfirmDisabled: {
    backgroundColor: '#A0A0A0',
  }
});
