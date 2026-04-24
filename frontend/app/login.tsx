import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { Colors } from '../assets/images/constants/Colors';
import { globalStyles } from '../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import IconApp from '../assets/images/IconApp.png'; //Import


export default function Login() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

          <Link href="/(tabs)/home" asChild>
            <TouchableOpacity style={globalStyles.buttonAuth}>
              <Text style={globalStyles.buttonTextAuth}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

