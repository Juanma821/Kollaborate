import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; //install
import DateTimePicker from '@react-native-community/datetimepicker'; //install
import Checkbox from 'expo-checkbox'; //install
import { Picker } from '@react-native-picker/picker'; //Install

export default function EditProfile() {
const insets = useSafeAreaInsets();
  const [isSelected, setSelection] = useState(false);

  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estado para el DatePicker
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [textoFecha, setTextoFecha] = useState('Seleccionar fecha');

  // Función para manejar el cambio de fecha
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || fecha;
    setMostrarPicker(Platform.OS === 'ios');
    setFecha(currentDate);

    const dia = currentDate.getDate().toString().padStart(2, '0');
    const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const anio = currentDate.getFullYear();
    setTextoFecha(`${dia} / ${mes} / ${anio}`);
  };

  // Estado para la Institución
  const [institucion, setInstitucion] = useState(''); 


  return (
<KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 20 }]}
      >

        {/* GRUPO DE INPUTS */}
        <View style={styles.form}>
          
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Tu nombre" />

          <Text style={styles.label}>Apellido</Text>
          <TextInput style={styles.input} value={apellido} onChangeText={setApellido} placeholder="Tu apellido" />

          <Text style={styles.label}>Alias</Text>
          <TextInput style={styles.input} value={alias} onChangeText={setAlias} placeholder="@ejemplo" />

          <Text style={styles.label}>Cumpleaños</Text>
          <TouchableOpacity 
            style={styles.inputSimulado} 
            onPress={() => setMostrarPicker(true)}
          >
            <Text style={styles.inputText}>{textoFecha}</Text>
          </TouchableOpacity>

          {/* mostrarPicker = true */}
          {mostrarPicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeFecha}
              maximumDate={new Date()}
            />
          )}

          {/* --- SECCIÓN INSTITUCIÓN (PICKER) --- */}
          <Text style={styles.label}>Institución</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={institucion}
              onValueChange={(itemValue) => setInstitucion(itemValue)}
              dropdownIconColor="#ff743dff"
            >
              <Picker.Item label="Selecciona una institución" value="" />
              <Picker.Item label="Duoc UC" value="duoc" />
              <Picker.Item label="Uni. de Chile" value="uchile" />
              <Picker.Item label="Uni. Católica" value="puc" />
              <Picker.Item label="Inacap" value="inacap" />
              <Picker.Item label="Otra" value="otra" />
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
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="********" />

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" />

        </View>

        {/* PREFERENCIAS */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Usar alias como nombre de visualización</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Hacer pública la afiliación académica</Text>
        </View>

        {/* BOTÓN */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilo Backgroud y Contenedores
const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  form: {
    gap: 15,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: -10, 
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputSimulado: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
// Estilo Botón Guardar Cambios
  saveButton: {
    backgroundColor: '#ff743dff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    // IOS
    ...Platform.select({
      ios: { paddingVertical: 10 },
      android: { height: 55 }
    })
  },
});