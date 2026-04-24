import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';

import { Colors } from '../../assets/images/constants/Colors';
import { globalStyles } from '../../assets/images/constants/globalStyles';

import { Calendar, LocaleConfig } from 'react-native-calendars'; //install
import { Ionicons } from '@expo/vector-icons'; //install
import { useSafeAreaInsets } from 'react-native-safe-area-context'; //install

// Configuración Calendario
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
};
LocaleConfig.defaultLocale = 'es';

export default function Classroom() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState('');

  // Ejemplo dias marcados
  const markedDates = {
    '2026-04-25': { marked: true, dotColor: '#ff743dff', activeOpacity: 0 },
    '2026-04-28': { marked: true, dotColor: '#ff743dff', activeOpacity: 0 },
  };

  const handleJoinMeeting = (url) => {
    if (url) {
      Linking.openURL(url); // url para abrir google meet
    }
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      <Text style={globalStyles.headerTitle}>Mi Agenda</Text>

      {/* Calendario Interactivo */}
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

      {/* Detalle de Sesión */}
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Próximas Sesiones</Text>
        
        {/* Tarjeta de Sesión (BD) */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionInfo}>
            <Text style={styles.skillName}>React Native Avanzado</Text>
            <Text style={styles.sessionTime}>
              <Ionicons name="time-outline" size={14} /> 25 de Abril - 18:00 hrs
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.meetButton}
            onPress={() => handleJoinMeeting('https://meet.google.com/abc-defg-hij')}
          >
            <Ionicons name="videocam" size={20} color="#fff" />
            <Text style={styles.meetButtonText}>Unirse a Meet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    padding: 20, 
    color: Colors.textDark,
    textAlign: 'center' 
  },
  calendarContainer: { 
    backgroundColor: Colors.whiteBg, 
    marginHorizontal: 15, 
    borderRadius: 15, 
    elevation: 4, 
    paddingBottom: 10 }
    ,
  detailsContainer: { 
    flex: 1, 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 15, 
    color: Colors.textMuted
  },
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
  sessionInfo: { 
    flex: 1 
  },
  skillName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: Colors.textDark 
  },
  sessionTime: { 
    fontSize: 13, 
    color: '#888', 
    marginTop: 5 
  },
  meetButton: {
    backgroundColor: '#00796b',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  meetButtonText: { 
    color: Colors.textLight, 
    marginLeft: 8, 
    fontWeight: '600' 
  }
});