import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { Colors } from '../assets/images/constants/Colors';
import { globalStyles } from '../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import IconApp from '../assets/images/IconApp.png'; //Import

export default function Newpass() {
  const insets = useSafeAreaInsets();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }} >
      <View style={[globalStyles.containerAuth, { paddingTop: insets.top }]}>

        {/* SECCIÓN SUPERIOR: Logo */}
        <View style={[globalStyles.iconContainerAuthB, { flex: 0.3 }]}>
          <Image source={IconApp} style={globalStyles.profileImageAuthA} />
          <Text style={globalStyles.titleAuth}>Nueva Contraseña</Text>
        </View>

        {/* SECCIÓN INFERIOR: Formulario y Botones */}
        <View style={globalStyles.bottomSectionAuth}>
          <View style={globalStyles.formAuth}>
            <Text style={globalStyles.labelAuth}>Nueva Contraseña</Text>
            <TextInput style={globalStyles.inputAuth} value={newPassword} onChangeText={setNewPassword} placeholder="********" secureTextEntry placeholderTextColor="#aaa" />

            <Text style={globalStyles.labelAuth}>Confirmar Nueva Contraseña</Text>
            <TextInput style={globalStyles.inputAuth} value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder="********" secureTextEntry placeholderTextColor="#aaa" />

          </View>

          <Link href="/(tabs)/home" asChild>
            <TouchableOpacity style={globalStyles.buttonAuth}>
              <Text style={globalStyles.buttonTextAuth}>Cambiar Contraseña</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
