import { Link, router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';

import { Colors } from '../assets/images/constants/Colors';
import { globalStyles } from '../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import IconApp from '../assets/images/IconApp.png';
import { getInstitutionsRequest, loginRequest, registerRequest, type Institution } from './_utils/api';
import { saveAuthSession } from './_utils/authStorage';

export default function Signup() {
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [alias, setAlias] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await getInstitutionsRequest();
        setInstitutions(data);
      } catch (error) {
        console.log('Error cargando instituciones:', error);
        setError('No se pudieron cargar las instituciones');
        setInstitutions([]);
      } finally {
        setLoadingInstitutions(false);
      }
    };

    loadInstitutions();
  }, []);

  const suggestedAlias = useMemo(() => {
    const fromName = `${nombre}.${apellido}`.replace(/\s+/g, '').toLowerCase();
    return fromName.replace(/\.+/g, '.').replace(/^\./, '').replace(/\.$/, '');
  }, [nombre, apellido]);

  const handleSignup = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedAlias = (alias || suggestedAlias).trim().toLowerCase();

    if (!nombre.trim() || !apellido.trim() || !normalizedEmail || !password || !confirmPassword) {
      setError('Completa los campos obligatorios');
      return;
    }

    if (!normalizedAlias) {
      setError('Ingresa un alias válido');
      return;
    }

    if (!institucion) {
      setError('Selecciona una institución');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await registerRequest({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        alias: normalizedAlias,
        email: normalizedEmail,
        password,
        institucion_id: Number(institucion),
      });

      const loginData = await loginRequest(normalizedEmail, password);
      await saveAuthSession(loginData.token, loginData.user);

      router.replace('/(tabs)/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo registrar';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[globalStyles.containerAuth, { alignItems: 'center', justifyContent: 'center', paddingTop: insets.top }]}>
        <View style={styles.iconContainer}>
          <Image source={IconApp} style={globalStyles.profileImageAuthB} />
          <Text style={globalStyles.titleAuth}>Crear cuenta</Text>
          <Link href="/login">
            <Text style={globalStyles.subtitleAuth}>
              ¿Ya tienes una cuenta? <Text style={globalStyles.linkTextAuth}>Inicia sesión aquí</Text>
            </Text>
          </Link>
        </View>

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

              <Text style={globalStyles.labelAuth}>Alias</Text>
              <TextInput
                style={globalStyles.inputAuth}
                value={alias}
                onChangeText={setAlias}
                placeholder={suggestedAlias || 'tu.alias'}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
              />

              <Text style={globalStyles.labelAuth}>Institución</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={institucion}
                  onValueChange={(itemValue) => setInstitucion(String(itemValue))}
                  dropdownIconColor="#ff743dff"
                  mode="dropdown"
                >
                  <Picker.Item
                    label={loadingInstitutions ? 'Cargando instituciones...' : 'Selecciona una institución'}
                    value=""
                    color="#999"
                  />
                  {institutions.map((item) => (
                    <Picker.Item key={item.id} label={item.nombre} value={String(item.id)} />
                  ))}
                </Picker>
              </View>

              <Text style={globalStyles.labelAuth}>Correo electrónico</Text>
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

              <Text style={globalStyles.labelAuth}>Confirmar contraseña</Text>
              <TextInput style={globalStyles.inputAuth} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" placeholderTextColor="#aaa" secureTextEntry />

              {!!error && (
                <Text style={[globalStyles.linkTextAuth, { textAlign: 'center', marginTop: 10 }]}>
                  {error}
                </Text>
              )}

              <TouchableOpacity
                style={[globalStyles.buttonAuth, loading && { opacity: 0.7 }]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={globalStyles.buttonTextAuth}>
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  bottomSection: {
    flex: 0.65,
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
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
