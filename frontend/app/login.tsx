import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

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
      <View style={[styles.container, { paddingTop: insets.top }]}>

        {/* SECCIÓN SUPERIOR: Logo */}
        <View style={styles.iconContainer}>
          <Image source={IconApp} style={styles.profileImage} />
          <Text style={styles.title}>¡Bienvenido!</Text>
          <Link href="/signup">
            <Text style={styles.subtitle}>¿No tienes una cuenta? <Text style={styles.linkText}>Regístrate aquí</Text></Text>
          </Link>
        </View>

        {/* SECCIÓN INFERIOR: Formulario y Botones */}
        <View style={styles.bottomSection}>
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com" placeholderTextColor="#aaa" />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="********" secureTextEntry placeholderTextColor="#aaa" />

            <TouchableOpacity>
              <Link href="/recoverpass"><Text style={[styles.linkText, { textAlign: 'center' }]}>¿Olvidaste tu contraseña?</Text></Link>
            </TouchableOpacity>
          </View>

          <Link href="/(tabs)/home" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </Link>
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
  },
  // Estilos Sección Superior: Logo
  iconContainer: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#131313',
    marginBottom: 25,
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
  bottomSection: {
    flex: 0.65,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
    marginBottom: 20,
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