import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';

import { Colors } from '../assets/images/constants/Colors';
import { globalStyles } from '../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import { Picker } from '@react-native-picker/picker'; // install
import IconApp from '../assets/images/IconApp.png';  //Import

export default function Signup() {
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <View style={[globalStyles.containerAuth, {alignItems: 'center', justifyContent: 'center', paddingTop: insets.top }]}>
        
        {/* SECCIÓN SUPERIOR: Logo*/}
        <View style={styles.iconContainer}>
          <Image source={IconApp} style={globalStyles.profileImageAuthB}/>
          <Text style={globalStyles.titleAuth}>Crear cuenta</Text>
          <Link href="/login"> 
              <Text style={globalStyles.subtitleAuth}>¿Ya tienes una cuenta? <Text style={globalStyles.linkTextAuth}>Inicia sesión aquí</Text></Text>
          </Link>
        </View>

        {/* SECCIÓN INFERIOR: Formulario con Scroll */}
        <View style={styles.bottomSection}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={globalStyles.formAuth}>
              <Text style={globalStyles.labelAuth}>Nombre</Text>
              <TextInput style={globalStyles.inputAuth} value={nombre} onChangeText={setNombre} placeholder="Tu nombre" placeholderTextColor="#aaa" />

              <Text style={globalStyles.labelAuth}>Apellido</Text>
              <TextInput style={globalStyles.inputAuth} value={apellido} onChangeText={setApellido} placeholder="Tu apellido" placeholderTextColor="#aaa" />

              <Text style={globalStyles.labelAuth}>Institución</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={institucion}
                  onValueChange={(itemValue) => setInstitucion(itemValue)}
                  dropdownIconColor="#ff743dff"
                  mode="dropdown"
                >
                  <Picker.Item label="Selecciona una institución" value="" color="#999" />
                  <Picker.Item label="Duoc UC" value="duoc" />
                  <Picker.Item label="U. de Chile" value="uchile" />
                  <Picker.Item label="U. Católica" value="puc" />
                  <Picker.Item label="Inacap" value="inacap" />
                </Picker>
              </View>

              <Text style={globalStyles.labelAuth}>Correo Electrónico</Text>
              <TextInput 
                style={globalStyles.inputAuth} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none"
                placeholder="correo@institucion.cl"
                placeholderTextColor="#aaa"
              />

              <Text style={globalStyles.labelAuth}>Contraseña</Text>
              <TextInput style={globalStyles.inputAuth} value={password} onChangeText={setPassword} placeholder="********" placeholderTextColor="#aaa" secureTextEntry />

              <Text style={globalStyles.labelAuth}>Confirmar Contraseña</Text>
              <TextInput style={globalStyles.inputAuth} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" placeholderTextColor="#aaa" secureTextEntry />

              {/* Botón */}
              <TouchableOpacity style={globalStyles.buttonAuth}>
                <Text style={globalStyles.buttonTextAuth}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos Propios
const styles = StyleSheet.create({
  // Sección Superior: Logo
  iconContainer: {
    flex: 0.25, 
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  // Sección Inferior: Formulario y Botones
  bottomSection: {
    flex: 0.65,
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40, 
  },

  // Picker
  pickerContainer: {
    backgroundColor: Colors.input,
    borderRadius: 10,
    width: '100%',
    overflow: 'hidden', 
    ...Platform.select({
      ios: { paddingVertical: 0 },
      android: { height: 50, justifyContent: 'center' }
    })
  },
});