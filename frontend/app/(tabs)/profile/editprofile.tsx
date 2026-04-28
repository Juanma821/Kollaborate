import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import {
  getInstitutionsRequest,
  getUserProfileRequest,
  updateUserProfileRequest,
  type Institution,
} from '../../_utils/api';
import {
  getStoredUser,
  getToken,
  updateStoredUser,
  type StoredUser,
} from '../../_utils/authStorage';

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [instituciones, setInstituciones] = useState<Institution[]>([]);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [institucionId, setInstitucionId] = useState('');

  const [fechaNac, setFechaNac] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [textoFecha, setTextoFecha] = useState('Seleccionar fecha');

  useEffect(() => {
    const cargarInfo = async () => {
      setLoading(true);

      try {
        const token = await getToken();
        const storedUser = await getStoredUser();

        if (!token || !storedUser) {
          Alert.alert('Error', 'No hay sesion activa.');
          return;
        }

        const [dataInst, profile] = await Promise.all([
          getInstitutionsRequest(),
          getUserProfileRequest(token, storedUser.id),
        ]);

        setInstituciones(dataInst);

        setNombre(profile.nombre || '');
        setApellido(profile.apellido || '');
        setAlias(profile.alias || '');
        setEmail(profile.email || '');
        setInstitucionId(profile.institucion_id ? String(profile.institucion_id) : '');

        if (profile.fecha_nacimiento) {
          const dateObj = new Date(profile.fecha_nacimiento);
          setFechaNac(dateObj);
          setTextoFecha(dateObj.toLocaleDateString());
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo cargar el perfil.';
        Alert.alert('Error', message);
      } finally {
        setLoading(false);
      }
    };

    cargarInfo();
  }, []);

  const onChangeFecha = (_event: any, selectedDate?: Date) => {
    setMostrarPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaNac(selectedDate);
      setTextoFecha(selectedDate.toLocaleDateString());
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = await getToken();
      const storedUser = await getStoredUser();

      if (!token || !storedUser) {
        Alert.alert('Error', 'No hay sesion activa.');
        return;
      }

      const updatedProfile = await updateUserProfileRequest(token, storedUser.id, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        alias: alias.trim().toLowerCase(),
        email,
        institucion_id: institucionId ? Number(institucionId) : null,
        fecha_nacimiento: fechaNac.toISOString().split('T')[0],
      });

      const mergedUser: StoredUser = {
        ...storedUser,
        nombre: updatedProfile.nombre,
        apellido: updatedProfile.apellido,
        alias: updatedProfile.alias,
        email: updatedProfile.email,
        institucion_id: updatedProfile.institucion_id ?? null,
        institucion_nombre: updatedProfile.institucion_nombre ?? null,
        rol: updatedProfile.rol,
      };

      await updateStoredUser(mergedUser);

      Alert.alert('Exito', 'Perfil actualizado correctamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el perfil';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView
        contentContainerStyle={[globalStyles.scrollContainer, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.form}>
          <Text style={[globalStyles.label, { marginBottom: -10 }]}>Nombre</Text>
          <TextInput
            style={[globalStyles.input, { padding: 15, fontSize: 16 }]}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre"
          />

          <Text style={[globalStyles.label, { marginBottom: -10 }]}>Apellido</Text>
          <TextInput
            style={[globalStyles.input, { padding: 15, fontSize: 16 }]}
            value={apellido}
            onChangeText={setApellido}
            placeholder="Tu apellido"
          />

          <Text style={[globalStyles.label, { marginBottom: -10 }]}>Alias</Text>
          <TextInput
            style={[globalStyles.input, { padding: 15, fontSize: 16 }]}
            value={alias}
            onChangeText={setAlias}
            placeholder="@ejemplo"
            autoCapitalize="none"
          />

          <Text style={[globalStyles.label, { marginBottom: -10 }]}>Cumpleanos</Text>
          <TouchableOpacity style={styles.inputSimulado} onPress={() => setMostrarPicker(true)}>
            <Text style={globalStyles.inputText}>{textoFecha}</Text>
          </TouchableOpacity>

          {mostrarPicker && (
            <DateTimePicker
              value={fechaNac}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeFecha}
              maximumDate={new Date()}
            />
          )}

          <Text style={[globalStyles.label, { marginBottom: -10 }]}>Institucion</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={institucionId}
              onValueChange={(itemValue) => setInstitucionId(String(itemValue))}
              dropdownIconColor="#ff743dff"
            >
              <Picker.Item label="Selecciona una institucion" value="" />
              {instituciones.map((inst) => (
                <Picker.Item key={inst.id} label={inst.nombre} value={String(inst.id)} />
              ))}
            </Picker>
          </View>

          <Text style={[globalStyles.label, { marginBottom: -10 }]}>Correo electronico</Text>
          <TextInput
            style={[globalStyles.input, { padding: 15, fontSize: 16 }]}
            value={email}
            editable={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 15,
    marginBottom: 25,
  },
  inputSimulado: {
    backgroundColor: Colors.input,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: Colors.colorCard,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: Colors.input,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    ...Platform.select({
      ios: { paddingVertical: 10 },
      android: { height: 55 }
    })
  },
});
