import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

import { Colors } from '../../../../assets/images/constants/Colors';
import { globalStyles } from '../../../../assets/images/constants/globalStyles';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReportIssue() {
  const insets = useSafeAreaInsets();
  const [tipo, setTipo] = useState('Falla Técnica');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = () => {
    if (descripcion.length < 10) {
      Alert.alert("Error", "Por favor, describe el problema con más detalle.");
      return;
    }
    // Aquí iría el INSERT a la tabla INCIDENCIAS
    Alert.alert("Enviado", "Tu reporte ha sido recibido. El administrador lo revisará pronto.");
    setDescripcion('');
  };

  return (
    <ScrollView style={[globalStyles.containerApp, { paddingTop: insets.top, padding: 20 }]}>
      <Text style={styles.title}>Centro de Soporte</Text>
      <Text style={styles.subtitle}>Cuéntanos qué sucedió para poder ayudarte.</Text>

      {/* Selector de Tipo (Simplificado) */}
      <Text style={styles.label}>Tipo de incidencia</Text>
      <View style={styles.pickerSimulado}>
        <Text>{tipo}</Text>
        <Ionicons name="caret-down" size={16} color="#666" />
      </View>

      {/* Input de Descripción */}
      <Text style={styles.label}>Descripción detallada</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe el error o problema aquí..."
        multiline
        numberOfLines={6}
        value={descripcion}
        onChangeText={setDescripcion}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar Reporte</Text>
      </TouchableOpacity>
      
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#ff743dff" />
        <Text style={styles.infoText}>
          Tus reportes ayudan a mantener la comunidad segura y funcional.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: Colors.textDark, 
    marginBottom: 10,
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 14, 
    color: Colors.textMuted, 
    marginBottom: 25,
    textAlign: 'center' 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: Colors.textLabel, 
    marginBottom: 8, 
    marginTop: 15 
  },
  pickerSimulado: {
    backgroundColor: Colors.card,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderDefault
  },
  textArea: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 15,
    height: 150,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    fontSize: 16,
    color: Colors.textDark
  },
  submitButton: {
    backgroundColor: Colors.colorCard,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30
  },
  submitButtonText: { 
    color: Colors.textLight, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff1eb',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center'
  },
  infoText: { 
    flex: 1, 
    color: Colors.primary, 
    fontSize: 12, 
    marginLeft: 10 
  }
});