import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { globalStyles } from '../assets/images/constants/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconApp from '../assets/images/IconApp.png';
import { loginRequest } from './_utils/api';
import { saveAuthSession } from './_utils/authStorage';

export default function Login() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError('Ingresa tu correo y tu contraseña');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await loginRequest(normalizedEmail, password);
      await saveAuthSession(data.token, data.user);
      router.replace('/(tabs)/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de conexion';
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
          <Text style={globalStyles.titleAuth}>Bienvenido</Text>
          <Link href="/signup">
            <Text style={globalStyles.subtitleAuth}>
              ¿No tienes una cuenta? <Text style={globalStyles.linkTextAuth}>Registrate aquí</Text>
            </Text>
          </Link>
        </View>

        <View style={globalStyles.bottomSectionAuth}>
          <View style={globalStyles.formAuth}>
            <Text style={globalStyles.labelAuth}>Email</Text>
            <TextInput
              style={globalStyles.inputAuth}
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={globalStyles.labelAuth}>Contraseña</Text>
            <TextInput
              style={globalStyles.inputAuth}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity>
              <Link href="/recoverpass">
                <Text style={[globalStyles.linkTextAuth, { textAlign: 'center' }]}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </Link>
            </TouchableOpacity>

            {!!error && (
              <Text style={[globalStyles.linkTextAuth, { textAlign: 'center', marginTop: 10 }]}>
                {error}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[globalStyles.buttonAuth, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={globalStyles.buttonTextAuth}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


