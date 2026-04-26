import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; //install
import DateTimePicker from '@react-native-community/datetimepicker'; //install
import Checkbox from 'expo-checkbox'; //install
import { Picker } from '@react-native-picker/picker'; //Install

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [instituciones, setInstituciones] = useState<any[]>([]);

  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [institucionId, setInstitucionId] = useState('');

  // Estado para el DatePicker
  const [fechaNac, setFechaNac] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [textoFecha, setTextoFecha] = useState('Seleccionar fecha');

  // Estados para Preferencias (Checkboxes independientes)
  const [usarAliasVisualizacion, setUsarAliasVisualizacion] = useState(false);
  const [publicarAfiliacion, setPublicarAfiliacion] = useState(false);

  // Carga Datos
  useEffect(() => {
    const cargarInfo = async () => {
      setLoading(true);
      try {
        // Instituciones para el Picker
        const resInst = await fetch('http://localhost:3000/api/institutions');
        const dataInst = await resInst.json();
        setInstituciones(dataInst);

        // Cargar datos del usuario (ID 1 como ejemplo)
        const resUser = await fetch('http://localhost:3000/api/users');
        const u = await resUser.json();

        setNombre(u.nombre || '');
        setApellido(u.apellido || '');
        setAlias(u.alias || '');
        setEmail(u.email || '');
        setInstitucionId(u.institucion_id?.toString() || '');

        if (u.fecha_nacimiento) {
          const dateObj = new Date(u.fecha_nacimiento);
          setFechaNac(dateObj);
          setTextoFecha(dateObj.toLocaleDateString());
        }

        // Cargar preferencias (asumiendo que vienen como 0/1 de la DB)
        setUsarAliasVisualizacion(u.pref_use_alias === 1);
        setPublicarAfiliacion(u.pref_public_inst === 1);

      } catch (error) {
        Alert.alert("Error", "No se pudo conectar con el servidor para cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    cargarInfo();
  }, []);

  // Función para manejar el cambio de fecha
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    setMostrarPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaNac(selectedDate);
      setTextoFecha(selectedDate.toLocaleDateString());
    }
  };

  // Guardar Cambios
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          alias,
          institucion_id: institucionId ? parseInt(institucionId) : null,
          fecha_nacimiento: fechaNac.toISOString().split('T')[0],
          pref_use_alias: usarAliasVisualizacion ? 1 : 0,
          pref_public_inst: publicarAfiliacion ? 1 : 0
        }),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Perfil actualizado correctamente");
      } else {
        const err = await response.json();
        Alert.alert("Error", err.error || "No se pudo actualizar el perfil");
      }
    } catch (error) {
      Alert.alert("Error", "Fallo de red al intentar guardar");
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

        {/* Formulario*/}
        <View style={styles.form}>

          <Text style={[globalStyles.label,{marginBottom: -10,}]}>Nombre</Text>
          <TextInput style={[globalStyles.input, { padding: 15, fontSize: 16, }]} value={nombre} onChangeText={setNombre} placeholder="Tu nombre" />

          <Text style={[globalStyles.label,{marginBottom: -10,}]}>Apellido</Text>
          <TextInput style={[globalStyles.input, { padding: 15, fontSize: 16, }]} value={apellido} onChangeText={setApellido} placeholder="Tu apellido" />

          <Text style={[globalStyles.label,{marginBottom: -10,}]}>Alias</Text>
          <TextInput style={[globalStyles.input, { padding: 15, fontSize: 16, }]} value={alias} onChangeText={setAlias} placeholder="@ejemplo" />

          <Text style={[globalStyles.label,{marginBottom: -10,}]}>Cumpleaños</Text>
          <TouchableOpacity style={styles.inputSimulado} onPress={() => setMostrarPicker(true)}>
            <Text style={globalStyles.inputText}>{textoFecha}</Text>
          </TouchableOpacity>

          {/* Picker*/}
          {mostrarPicker && (
            <DateTimePicker
              value={fechaNac}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeFecha}
              maximumDate={new Date()}
            />
          )}

          {/* --- SECCIÓN INSTITUCIÓN (PICKER) --- */}
          <Text style={[globalStyles.label,{marginBottom: -10,}]}>Institución</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={institucionId}
              onValueChange={(itemValue) => setInstitucionId(itemValue)}
              dropdownIconColor="#ff743dff"
            >
              <Picker.Item label="Selecciona una institución" value="" />
              {instituciones.map((inst) => (
                <Picker.Item key={inst.ID} label={inst.NOMBRE} value={inst.ID.toString()} />
              ))}
            </Picker>
          </View>

          <Text style={[globalStyles.label,{marginBottom: -10,}]}>Correo Electrónico</Text>
          <TextInput 
            style={[globalStyles.input, {padding: 15, fontSize: 16}]} 
            value={email} 
            editable={false} 
          />          
        </View>

        {/* PREFERENCIAS */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={usarAliasVisualizacion}
            onValueChange={setUsarAliasVisualizacion}
            style={styles.checkbox}
            color={usarAliasVisualizacion ? '#ff743dff' : undefined}
          />
          <Text style={[globalStyles.label,{marginBottom: -10,}]}>Usar alias como nombre de visualización</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={publicarAfiliacion}
            onValueChange={setPublicarAfiliacion}
            style={styles.checkbox}
            color={publicarAfiliacion ? '#ff743dff' : undefined}
          />
          <Text style={[globalStyles.label,{marginBottom: -10,}]}>Hacer pública la afiliación académica</Text>
        </View>
      

        {/* BOTÓN */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos Propios
const styles = StyleSheet.create({
  //Formulario
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
  // Estilo Botón Guardar Cambios
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
  // Estilo Preferencias (Checkbox)
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    gap: 15
  },
  checkbox: {
    alignSelf: 'center'
  },

  // Estilo Picker
  pickerContainer: {
    backgroundColor: Colors.input,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    // IOS
    ...Platform.select({
      ios: { paddingVertical: 10 },
      android: { height: 55 }
    })
  },
});