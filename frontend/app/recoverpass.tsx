import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { globalStyles } from '../assets/images/constants/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconApp from '../assets/images/IconApp.png';
import { forgotPasswordRequest } from './_utils/api';
import { saveRecoveryCode, saveRecoveryEmail } from './_utils/authStorage';

export default function Recoverpass() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Ingresa tu correo electronico');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await forgotPasswordRequest(normalizedEmail);

      await saveRecoveryEmail(normalizedEmail);
      if (data.codigo) {
        await saveRecoveryCode(data.codigo);
      }

      router.push('/verification');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar la recuperacion';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <View style={[globalStyles.containerAuth, { paddingTop: insets.top }]}>
        <View style={globalStyles.iconContainerAuthA}>
          <Image source={IconApp} style={globalStyles.profileImageAuthA} />
          <Text style={globalStyles.titleAuth}>Recuperar contrasena</Text>
          <Text style={globalStyles.subtitleAuth}>Ingresa tu correo electronico</Text>
        </View>

        <View style={globalStyles.bottomSectionAuth}>
          <View style={globalStyles.formAuth}>
            <TextInput
              style={globalStyles.inputAuth}
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {!!error && (
              <Text style={[globalStyles.linkTextAuth, { textAlign: 'center', marginTop: 10 }]}>
                {error}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[globalStyles.buttonAuth, loading && { opacity: 0.7 }]}
            onPress={handleRecover}
            disabled={loading}
          >
            <Text style={globalStyles.buttonTextAuth}>
              {loading ? 'Enviando...' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
//