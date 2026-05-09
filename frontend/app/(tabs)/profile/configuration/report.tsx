import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../../../assets/images/constants/Colors';
import { globalStyles } from '../../../../assets/images/constants/globalStyles';
import { getToken } from '../../../_utils/authStorage';
import { createReporteRequest, getMisSesionesRequest } from '../../../_utils/api';

export default function ReportIssue() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Estados del Formulario
  const [tipo, setTipo] = useState('Falla Técnica');
  const [prioridad, setPrioridad] = useState('Media');
  const [descripcion, setDescripcion] = useState('');
  
  // Estados de Datos de Sesión
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState<number | null>(null);
  
  // Estados de Carga
  const [loadingPagina, setLoadingPagina] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getMisSesionesRequest(token);
          setSesiones(data);
        }
      } catch (error) {
        console.error("Error al obtener sesiones");
      } finally {
        setLoadingPagina(false);
      }
    };
    cargarDatosIniciales();
  }, []);

  const handleSubmit = async () => {
    if (!sesionSeleccionada) {
      Alert.alert("Error", "Debes seleccionar una sesión de la lista.");
      return;
    }

    if (descripcion.length < 10) {
      Alert.alert("Error", "La descripción debe tener al menos 10 caracteres.");
      return;
    }

    try {
      setIsSending(true);
      const token = await getToken();
      if (!token) return;

      await createReporteRequest(token, {
        sesion_id: sesionSeleccionada,
        tipo_incidencia: tipo,
        descripcion: descripcion,
        prioridad: prioridad
      });

      Alert.alert("Éxito", "Incidencia reportada correctamente.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert("Error", "No se pudo registrar la incidencia.");
    } finally {
      setIsSending(false);
    }
  };

  if (loadingPagina) {
    return <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />;
  }

  return (
    <ScrollView style={[globalStyles.containerApp, { paddingHorizontal: 20 }]}>
      <View style={{ paddingTop: insets.top + 10, marginBottom: 30 }}>
        <Text style={styles.title}>Centro de Soporte</Text>
        <Text style={styles.subtitle}>Gestiona incidencias vinculadas a tus tutorías.</Text>

        {/* SELECCIÓN DE SESIÓN */}
        <Text style={styles.label}>1. Selecciona la sesión afectada:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sessionScroll}>
          {sesiones.length > 0 ? (
            sesiones.map((s) => (
              <TouchableOpacity 
                key={s.ID || s.id} 
                onPress={() => setSesionSeleccionada(s.ID || s.id)}
                style={[
                  styles.sessionChip, 
                  sesionSeleccionada === (s.ID || s.id) && styles.sessionChipActive
                ]}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={16} 
                  color={sesionSeleccionada === (s.ID || s.id) ? "#FFF" : "#666"} 
                />
                <Text style={[styles.sessionText, sesionSeleccionada === (s.ID || s.id) && styles.textWhite]}>
                  ID: #{s.ID || s.id}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No tienes sesiones disponibles para reportar.</Text>
          )}
        </ScrollView>

        {/* CATEGORÍA */}
        <Text style={styles.label}>2. ¿Qué tipo de problema es?</Text>
        <View style={styles.row}>
          {['Falla Técnica', 'Conducta', 'Tokens'].map((item) => (
            <TouchableOpacity 
              key={item} 
              onPress={() => setTipo(item)}
              style={[styles.typeChip, tipo === item && styles.typeChipActive]}
            >
              <Text style={[styles.typeText, tipo === item && styles.textWhite]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PRIORIDAD */}
        <Text style={styles.label}>3. Nivel de prioridad:</Text>
        <View style={styles.row}>
          {['Baja', 'Media', 'Alta'].map((p) => (
            <TouchableOpacity 
              key={p} 
              onPress={() => setPrioridad(p)}
              style={[
                styles.prioChip, 
                prioridad === p && (p === 'Alta' ? styles.prioAlta : styles.prioActive)
              ]}
            >
              <Text style={[styles.typeText, prioridad === p && styles.textWhite]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DESCRIPCIÓN */}
        <Text style={styles.label}>4. Descripción detallada:</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe brevemente lo ocurrido..."
          multiline
          numberOfLines={5}
          value={descripcion}
          onChangeText={setDescripcion}
          textAlignVertical="top"
        />

        {/* BOTÓN SUBMIT */}
        <TouchableOpacity 
          style={[styles.btnSubmit, isSending && styles.btnDisabled]} 
          onPress={handleSubmit}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="send" size={18} color="#FFF" style={{marginRight: 10}} />
              <Text style={styles.btnText}>Enviar Reporte</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={22} color={Colors.primary} />
          <Text style={styles.infoCardText}>
            Este reporte será revisado por administración. La resolución se notificará vía correo institucional.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 25 },
  label: { fontSize: 15, fontWeight: '700', color: '#444', marginBottom: 12, marginTop: 10 },
  sessionScroll: { flexDirection: 'row', marginBottom: 20 },
  sessionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  sessionChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sessionText: { marginLeft: 6, fontWeight: '600', color: '#666' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  typeChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  typeChipActive: { backgroundColor: Colors.primary },
  typeText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
  prioChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
  },
  prioActive: { backgroundColor: '#666' },
  prioAlta: { backgroundColor: '#E53935', borderColor: '#E53935' },
  textWhite: { color: '#FFF' },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    minHeight: 120,
    marginBottom: 25
  },
  btnSubmit: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    padding: 18,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  btnDisabled: { backgroundColor: '#BBB' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: '#999', fontStyle: 'italic', marginTop: 5 },
  infoCard: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardText: {
    marginLeft: 12,
    fontSize: 12,
    color: '#1976D2',
    flex: 1,
    lineHeight: 18
  }
});