import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, ActivityIndicator, Modal, Alert } from 'react-native';
import { Colors } from '../../assets/images/constants/Colors';
import { globalStyles } from '../../assets/images/constants/globalStyles';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { getSesionesRequest, finalizarSesionRequest, cancelarSesionRequest, type SesionItem } from '../_utils/api';
import { getToken } from '../_utils/authStorage';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
};
LocaleConfig.defaultLocale = 'es';

export default function Classroom() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState('');
  const [sesiones, setSesiones] = useState<SesionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSesion, setSelectedSesion] = useState<SesionItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSesiones();
    }, [])
  );

  const loadSesiones = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      const data = await getSesionesRequest(token);
      setSesiones(data ?? []);
    } catch (error) {
      console.error('Error cargando sesiones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizar = async (id: number) => {
    try {
      const token = await getToken();
      if (!token) return;
      const result = await finalizarSesionRequest(token, id);
      Alert.alert('Éxito', result.message);
      setModalVisible(false);
      await loadSesiones();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al finalizar';
      Alert.alert('Error', message);
    }
  };

  const handleCancelar = async (id: number) => {
    try {
      const token = await getToken();
      if (!token) return;
      const result = await cancelarSesionRequest(token, id);
      Alert.alert('Sesión cancelada', result.message);
      setModalVisible(false);
      await loadSesiones();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cancelar';
      Alert.alert('Error', message);
    }
  };

  const markedDates = sesiones.reduce((acc, sesion) => {
    const fecha = new Date(sesion.fecha_programada).toISOString().split('T')[0];
    acc[fecha] = { marked: true, dotColor: '#ff743dff', activeOpacity: 0 };
    return acc;
  }, {} as Record<string, any>);

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });
  };

  const estadoTexto = (estadoId: number) => {
    if (estadoId === 4) return 'Programada';
    if (estadoId === 5) return 'Completada';
    if (estadoId === 6) return 'Cancelada';
    return 'Desconocido';
  };

  const estadoColor = (estadoId: number) => {
    if (estadoId === 4) return Colors.BorderColor;
    if (estadoId === 5) return '#4caf50';
    if (estadoId === 6) return '#f44336';
    return '#ccc';
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      <Text style={globalStyles.headerTitle}>Mi Agenda</Text>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#ff743dff' }
          }}
          theme={{
            todayTextColor: '#ff743dff',
            arrowColor: '#ff743dff',
            dotColor: '#ff743dff',
          }}
        />
      </View>

      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Próximas Sesiones</Text>

        {loading && <ActivityIndicator size="large" color={Colors.primary} />}

        {!loading && sesiones.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Ionicons name="calendar-outline" size={60} color="#ccc" />
            <Text style={{ color: '#999', marginTop: 10 }}>No tenés sesiones agendadas</Text>
          </View>
        )}

        {sesiones.map((sesion) => (
          <TouchableOpacity
            key={sesion.id}
            style={[styles.sessionCard, { borderLeftColor: estadoColor(sesion.estado_id) }]}
            onPress={() => { setSelectedSesion(sesion); setModalVisible(true); }}
          >
            <View style={styles.sessionInfo}>
              <Text style={styles.skillName}>{sesion.habilidad}</Text>
              <Text style={styles.sessionTime}>{sesion.solicitante} → {sesion.receptor}</Text>
              <Text style={styles.sessionTime}>
                <Ionicons name="time-outline" size={14} /> {formatFecha(sesion.fecha_programada)}
              </Text>
              <Text style={[styles.estadoBadge, { color: estadoColor(sesion.estado_id) }]}>
                {estadoTexto(sesion.estado_id)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sesión</Text>

            {selectedSesion && (
              <>
                <Text style={styles.modalText}>
                  Habilidad: <Text style={{ fontWeight: 'bold' }}>{selectedSesion.habilidad}</Text>
                </Text>
                <Text style={styles.modalText}>{selectedSesion.solicitante} → {selectedSesion.receptor}</Text>
                <Text style={styles.modalText}>{formatFecha(selectedSesion.fecha_programada)}</Text>
                <Text style={[styles.modalText, { color: estadoColor(selectedSesion.estado_id) }]}>
                  {estadoTexto(selectedSesion.estado_id)}
                </Text>

                {selectedSesion.estado_id === 4 && (
                  <>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: '#00796b' }]}
                      onPress={() => Linking.openURL('https://meet.google.com')}
                    >
                      <Ionicons name="videocam" size={18} color="#fff" />
                      <Text style={styles.modalButtonText}>  Unirse a Meet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: '#4caf50' }]}
                      onPress={() => Alert.alert(
                        'Finalizar sesión',
                        'Se transferirán 10 tokens al receptor. ¿Confirmás?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Confirmar', onPress: () => handleFinalizar(selectedSesion.id) }
                        ]
                      )}
                    >
                      <Text style={styles.modalButtonText}>✓ Finalizar sesión (-10 tokens)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                      onPress={() => Alert.alert(
                        'Cancelar sesión',
                        '¿Estás seguro? No se transferirán tokens.',
                        [
                          { text: 'No', style: 'cancel' },
                          { text: 'Sí, cancelar', onPress: () => handleCancelar(selectedSesion.id) }
                        ]
                      )}
                    >
                      <Text style={styles.modalButtonText}>✕ Cancelar sesión</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#999', marginTop: 5 }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: Colors.whiteBg,
    marginHorizontal: 15,
    borderRadius: 15,
    elevation: 4,
    paddingBottom: 10
  },
  detailsContainer: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: Colors.textMuted },
  sessionCard: {
    backgroundColor: Colors.whiteBg,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: Colors.BorderColor
  },
  sessionInfo: { flex: 1 },
  skillName: { fontSize: 16, fontWeight: 'bold', color: Colors.textDark },
  sessionTime: { fontSize: 13, color: '#888', marginTop: 5 },
  estadoBadge: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.whiteBg,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center'
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  modalText: { fontSize: 15, marginBottom: 8, textAlign: 'center' },
  modalButton: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});