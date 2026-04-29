import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { Colors } from '../../assets/images/constants/Colors';
import { globalStyles } from '../../assets/images/constants/globalStyles';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { getSesionesRequest, type SesionItem } from '../_utils/api';
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

  // Marcar días con sesiones en el calendario
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
          <View key={sesion.id} style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.skillName}>{sesion.habilidad}</Text>
              <Text style={styles.sessionTime}>
                {sesion.solicitante} → {sesion.receptor}
              </Text>
              <Text style={styles.sessionTime}>
                <Ionicons name="time-outline" size={14} /> {formatFecha(sesion.fecha_programada)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.meetButton}
              onPress={() => Linking.openURL('https://meet.google.com')}
            >
              <Ionicons name="videocam" size={20} color="#fff" />
              <Text style={styles.meetButtonText}>Meet</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  meetButton: {
    backgroundColor: '#00796b',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  meetButtonText: { color: '#fff', marginLeft: 8, fontWeight: '600' }
});