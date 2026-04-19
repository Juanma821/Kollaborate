import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';

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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        
        {/* SECCIÓN SUPERIOR: Logo*/}
        <View style={styles.iconContainer}>
          <Image source={IconApp} style={styles.profileImage}/>
          <Text style={styles.title}>Crear cuenta</Text>
          <Link href="/login"> 
              <Text style={styles.subtitle}>¿Ya tienes una cuenta? <Text style={styles.linkText}>Inicia sesión aquí</Text></Text>
          </Link>
        </View>

        {/* SECCIÓN INFERIOR: Formulario con Scroll */}
        <View style={styles.bottomSection}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.form}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Tu nombre" placeholderTextColor="#aaa" />

              <Text style={styles.label}>Apellido</Text>
              <TextInput style={styles.input} value={apellido} onChangeText={setApellido} placeholder="Tu apellido" placeholderTextColor="#aaa" />

              <Text style={styles.label}>Institución</Text>
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

              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none"
                placeholder="correo@institucion.cl"
                placeholderTextColor="#aaa"
              />

              <Text style={styles.label}>Contraseña</Text>
              <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="********" placeholderTextColor="#aaa" secureTextEntry />

              <Text style={styles.label}>Confirmar Contraseña</Text>
              <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" placeholderTextColor="#aaa" secureTextEntry />

              {/* Botón */}
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Estilos Sección Superior: Logo
  iconContainer: {
    flex: 0.25, 
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  profileImage: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    backgroundColor: '#131313',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  linkText: {
    color: '#ff743dff',
    fontWeight: 'bold',
  },

// Estilos Sección Inferior: Formulario y Botones
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40, 
  },
  bottomSection: {
    flex: 0.75,
    width: '100%',
  },
  form: {
    width: '135%',
    maxWidth: 300,
    gap: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#aaa',
    marginBottom: -5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },

// Estilo Picker
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: '100%',
    overflow: 'hidden', 
    ...Platform.select({
      ios: { paddingVertical: 0 },
      android: { height: 50, justifyContent: 'center' }
    })
  },
  
  button: {
    backgroundColor: '#ff743dff',
    width: '100%',
    maxWidth: 300,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});