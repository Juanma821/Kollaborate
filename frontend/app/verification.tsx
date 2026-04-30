import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { Colors } from '../assets/images/constants/Colors';
import { globalStyles } from '../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconApp from '../assets/images/IconApp.png';
import { forgotPasswordRequest } from './_utils/api';
import { getRecoveryCode, getRecoveryEmail, saveRecoveryCode } from './_utils/authStorage';

export default function Verification() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [serverCode, setServerCode] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    const loadRecoveryData = async () => {
      const storedEmail = await getRecoveryEmail();
      const storedCode = await getRecoveryCode();

      setEmail(storedEmail || '');
      setServerCode(storedCode || '');
    };

    loadRecoveryData();
  }, []);

  const handleChange = (text: string, index: number) => {
    const cleanValue = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = cleanValue;
    setCode(newCode);

    if (cleanValue.length !== 0 && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');

    if (enteredCode.length !== 6) {
      Alert.alert('Código incompleto', 'Ingresa los 6 dígitos del código.');
      return;
    }

    if (serverCode && enteredCode !== serverCode) {
      Alert.alert('Código invalido', 'El código ingresado no coincide.');
      return;
    }

    router.push('/newpass');
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'No se encontro el correo para reenviar el código.');
      return;
    }

    try {
      setLoading(true);
      const data = await forgotPasswordRequest(email);

      if (data.codigo) {
        await saveRecoveryCode(data.codigo);
        setServerCode(data.codigo);
      }

      Alert.alert('Listo', 'Se genero un nuevo código de verificación.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo reenviar el código';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <View style={[globalStyles.containerAuth, { alignItems: 'center', paddingTop: insets.top }]}>
        <View style={[globalStyles.iconContainerAuthB, { flex: 0.4, paddingHorizontal: 40 }]}>
          <Image source={IconApp} style={globalStyles.profileImageAuthB} />
          <Text style={globalStyles.titleAuth}>Verificación</Text>
          <Text style={[globalStyles.subtitleAuth, { textAlign: 'center' }]}>
            Hemos generado un código de 6 dígitos para tu recuperación.
          </Text>
        </View>

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
            onPress={handleVerify}
          >
            <Text style={globalStyles.buttonTextAuth}>Verificar código</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 20 }} onPress={handleResend} disabled={loading}>
            <Text style={styles.resendText}>
              ¿No recibiste el código? <Text style={globalStyles.linkTextAuth}>{loading ? 'Reenviando...' : 'Reenviar'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    gap: 8,
    width: '100%',
    marginBottom: 40,
    flexWrap: 'wrap',
  },
  codeInput: {
    width: 48,
    height: 62,
    backgroundColor: Colors.input,
    borderRadius: 15,
    fontSize: 28,
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
