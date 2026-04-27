import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { Colors } from '../assets/images/constants/Colors';
import { globalStyles } from '../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import IconApp from '../assets/images/IconApp.png'; //Import

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';


export default function Login() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch("http://192.168.1.12:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const data = await res.json();

      await SecureStore.setItemAsync("token", data.token);

      router.replace("/(tabs)/home");

      } catch (error) {
        alert("Error de conexión");
        console.log(error);
      }
    };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <View style={[globalStyles.containerAuth, { paddingTop: insets.top }]}>

        {/* SECCIÓN SUPERIOR: Logo */}
        <View style={globalStyles.iconContainerAuthA}>
          <Image source={IconApp} style={globalStyles.profileImageAuthA} />
          <Text style={globalStyles.titleAuth}>¡Bienvenido!</Text>
          <Link href="/signup">
            <Text style={globalStyles.subtitleAuth}>¿No tienes una cuenta? <Text style={globalStyles.linkTextAuth}>Regístrate aquí</Text></Text>
          </Link>
        </View>

        {/* SECCIÓN INFERIOR: Formulario y Botones */}
        <View style={globalStyles.bottomSectionAuth}>
          <View style={globalStyles.formAuth}>
            <Text style={globalStyles.labelAuth}>Email</Text>
            <TextInput style={globalStyles.inputAuth} value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com" placeholderTextColor="#aaa" />

            <Text style={globalStyles.labelAuth}>Contraseña</Text>
            <TextInput style={globalStyles.inputAuth} value={password} onChangeText={setPassword} placeholder="********" secureTextEntry placeholderTextColor="#aaa" />

            <TouchableOpacity>
              <Link href="/recoverpass"><Text style={[globalStyles.linkTextAuth, { textAlign: 'center' }]}>¿Olvidaste tu contraseña?</Text></Link>
            </TouchableOpacity>
          </View>

            <TouchableOpacity style={globalStyles.buttonAuth} onPress={handleLogin}>
              <Text style={globalStyles.buttonTextAuth}>Iniciar Sesión</Text>
            </TouchableOpacity>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

