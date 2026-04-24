import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { Colors } from '../assets/images/constants/Colors';
import { globalStyles } from '../assets/images/constants/globalStyles';


import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import IconApp from '../assets/images/IconApp.png'; //Import

export default function Recoverpass() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <View style={[globalStyles.containerAuth, { paddingTop: insets.top }]}>

        {/* SECCIÓN SUPERIOR: Logo */}
        <View style={globalStyles.iconContainerAuthA}>
          <Image source={IconApp} style={globalStyles.profileImageAuthA} />
          <Text style={globalStyles.titleAuth}>Recuperar Contraseña</Text>
            <Text style={globalStyles.subtitleAuth}>Ingresa tu correo electrónico</Text>
        </View>

        {/* SECCIÓN INFERIOR: Formulario y Botones */}
        <View style={globalStyles.bottomSectionAuth}>
          <View style={globalStyles.formAuth}>
            <TextInput style={globalStyles.inputAuth} value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com" placeholderTextColor="#aaa" />
          </View>

          <Link href="/verification" asChild>
            <TouchableOpacity style={globalStyles.buttonAuth}>
              <Text style={globalStyles.buttonTextAuth}>Continuar</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
