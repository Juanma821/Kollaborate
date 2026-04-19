import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import IconApp from '../assets/images/IconApp.png'; //Import

export default function Verification() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Estados para cada dígito
  const [code, setCode] = useState(['', '', '', '']);

  // Referencias para saltar entre cada uno
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Escribir un dígito y saltar al siguiente
    if (text.length !== 0 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>

        {/* SECCIÓN SUPERIOR: Logo */}
        <View style={styles.iconContainer}>
          <Image source={IconApp} style={styles.profileImage} />
          <Text style={styles.title}>Verificación</Text>
          <Text style={styles.subtitle}>Hemos enviado un código de 4 dígitos a tu correo electrónico.</Text>
        </View>

        {/* SECCIÓN DE CÓDIGO */}
        <View style={styles.bottomSection}>
          <View style={styles.codeWrapper}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.codeInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                textContentType="oneTimeCode"
              />
            ))}
          </View>


          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/newpass')}
          >
            <Text style={styles.buttonText}>Verificar Código</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 20 }}>
            <Text style={styles.resendText}>¿No recibiste el código? <Text style={styles.linkText}>Reenviar</Text></Text>
          </TouchableOpacity>
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
  },
  // Estilos Sección Superior: Logo
  iconContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#131313',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
  // Estilos Sección Inferior: Formulario y Botones
  bottomSection: {
    flex: 0.6,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  codeWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginBottom: 40,
  },
  codeInput: {
    width: 60,
    height: 70,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    borderWidth: 2,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: '#ff743dff',
    width: '100%',
    maxWidth: 280,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#aaa',
    fontSize: 14,
  },
  linkText: {
    color: '#ff743dff',
    fontWeight: 'bold',
  },
});