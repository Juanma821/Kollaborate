import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { globalStyles } from '../assets/images/constants/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconApp from '../assets/images/IconApp.png';
import { resetPasswordRequest } from './_utils/api';
import { clearRecoveryData, getRecoveryCode, getRecoveryEmail } from './_utils/authStorage';

export default function Newpass() {
  const insets = useSafeAreaInsets();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setError('');

    if (!newPassword || !confirmNewPassword) {
      setError('Completa ambos campos');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    try {
      setLoading(true);

      const email = await getRecoveryEmail();
      const codigo = await getRecoveryCode();

      if (!email || !codigo) {
        setError('Faltan datos de recuperacion. Vuelve a iniciar el proceso.');
        return;
      }

      const data = await resetPasswordRequest(email, codigo, newPassword);
      await clearRecoveryData();

      Alert.alert('Exito', data.message || 'Contrasena actualizada correctamente');
      router.replace('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cambiar la contrasena';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }} >
      <View style={[globalStyles.containerAuth, { paddingTop: insets.top }]}>
        <View style={[globalStyles.iconContainerAuthB, { flex: 0.3 }]}>
          <Image source={IconApp} style={globalStyles.profileImageAuthA} />
          <Text style={globalStyles.titleAuth}>Nueva contrasena</Text>
        </View>

        <View style={globalStyles.bottomSectionAuth}>
          <View style={globalStyles.formAuth}>
            <Text style={globalStyles.labelAuth}>Nueva contrasena</Text>
            <TextInput
              style={globalStyles.inputAuth}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="********"
              secureTextEntry
              placeholderTextColor="#aaa"
            />

            <Text style={globalStyles.labelAuth}>Confirmar nueva contrasena</Text>
            <TextInput
              style={globalStyles.inputAuth}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="********"
              secureTextEntry
              placeholderTextColor="#aaa"
            />

            {!!error && (
              <Text style={[globalStyles.linkTextAuth, { textAlign: 'center', marginTop: 10 }]}>
                {error}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[globalStyles.buttonAuth, loading && { opacity: 0.7 }]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={globalStyles.buttonTextAuth}>
              {loading ? 'Actualizando...' : 'Cambiar contrasena'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
//