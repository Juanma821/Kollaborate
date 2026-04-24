import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { Colors } from '../assets/images/constants/Colors';
import { globalStyles } from '../assets/images/constants/globalStyles';

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
      <View style={[globalStyles.containerAuth, { alignItems: 'center', paddingTop: insets.top }]}>

        {/* SECCIÓN SUPERIOR: Logo */}
        <View style={[globalStyles.iconContainerAuthB, {flex: 0.4, paddingHorizontal: 40}]}>
          <Image source={IconApp} style={globalStyles.profileImageAuthB} />
          <Text style={globalStyles.titleAuth}>Verificación</Text>
          <Text style={[globalStyles.subtitleAuth, {textAlign: 'center'}]}>Hemos enviado un código de 4 dígitos a tu correo electrónico.</Text>
        </View>

        {/* SECCIÓN INFERIOR: Codigo*/}
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
            style={globalStyles.buttonAuth}
            onPress={() => router.push('/newpass')}
          >
            <Text style={globalStyles.buttonTextAuth}>Verificar Código</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 20 }}>
            <Text style={styles.resendText}>¿No recibiste el código? <Text style={globalStyles.linkTextAuth}>Reenviar</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos Propios
const styles = StyleSheet.create({
  //  Sección Inferior: Formulario y Botones
  bottomSection: {
    flex: 0.65,
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
    backgroundColor: Colors.input,
    borderRadius: 15,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.textDark,
    borderWidth: 2,
    borderColor: Colors.borderDefault,
  },
  resendText: {
    color: Colors.textPlaceholder,
    fontSize: 14,
  },

});