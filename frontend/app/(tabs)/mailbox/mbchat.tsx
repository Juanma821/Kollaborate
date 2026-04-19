import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ScrollView, Platform } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Tipos de datos para los mensajes
const MOCK_MESSAGES = [
  {
    id: '1',
    type: 'system',
    text: 'Solicitud aceptada. Utiliza los botones de abajo para coordinar la sesión.',
    created_at: new Date().toISOString(),
  },
];

export default function MBChat() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // ESTADOS
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  // Función para añadir mensajes al chat
  const sendAction = (texto: string, type: 'user_action' | 'proposal' = 'user_action') => {
    const newMessage = {
      id: Date.now().toString(),
      type: type,
      text: texto,
      user: { id: 'currentUser', name: 'Tú' },
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Manejador del DatePicker
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || fecha;
    setMostrarPicker(Platform.OS === 'ios'); // En iOS el picker queda abierto
    setFecha(currentDate);

    if (event.type === 'set') { // El usuario presionó "Ok"
      const dia = currentDate.getDate().toString().padStart(2, '0');
      const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const hora = currentDate.getHours().toString().padStart(2, '0');
      const minutos = currentDate.getMinutes().toString().padStart(2, '0');
      
      const mensajePropuesta = `📅 Propuesta de reunión: ${dia}/${mes} a las ${hora}:${minutos} hrs.`;
      sendAction(mensajePropuesta, 'proposal');
    }
  };

  // Renderizado de burbujas de mensaje
  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageWrapper, 
      item.user?.id === 'currentUser' ? styles.userMessageAlign : styles.otherMessageAlign
    ]}>
      <View style={[
        styles.messageContainer,
        item.type === 'system' && styles.systemMessage,
        item.user?.id === 'currentUser' && styles.userMessageCard
      ]}>
        {item.user && item.user.id !== 'currentUser' && (
          <Text style={styles.userName}>{item.user.name}</Text>
        )}
        <Text style={[
            styles.messageText,
            item.type === 'system' && styles.systemText
        ]}>
            {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: (Array.isArray(params.nombreChat) ? params.nombreChat[0] : params.nombreChat) || 'Acuerdo de Sesión' }} />
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />

      {/* PANEL DE ACCIONES ESTRUCTURADAS */}
      <View style={[styles.actionPanel, { paddingBottom: insets.bottom + 10 }]}>
        <Text style={styles.panelTitle}>Sugerir Acuerdo:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
          
          <TouchableOpacity style={styles.chip} onPress={() => setMostrarPicker(true)}>
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text style={styles.chipText}>Proponer Fecha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chip} onPress={() => sendAction('📍 Propongo usar Google Meet / Zoom')}>
            <Ionicons name="videocam-outline" size={18} color="#fff" />
            <Text style={styles.chipText}>Link Reunión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chip} onPress={() => sendAction('📝 ¿Hay algún material previo?')}>
            <Ionicons name="document-text-outline" size={18} color="#fff" />
            <Text style={styles.chipText}>Materiales</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, {backgroundColor: '#4CAF50'}]} onPress={() => sendAction('✔️')}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.chipText}>Aceptar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, {backgroundColor: '#af4c4c'}]} onPress={() => sendAction('❌')}>
            <Ionicons name="close-circle-outline" size={18} color="#fff" />
            <Text style={styles.chipText}>Denegar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, {backgroundColor: '#4c63af'}]} onPress={() => sendAction('✅ ¡He confirmado los detalles!')}>
            <Ionicons name="checkmark-done-circle-outline" size={18} color="#fff" />
            <Text style={styles.chipText}>Confirmar Acuerdo</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* COMPONENTE SELECTOR DE FECHA */}
      {mostrarPicker && (
        <DateTimePicker
          value={fecha}
          mode="datetime"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeFecha}
          minimumDate={new Date()} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  messagesList: { padding: 16 },
  messageWrapper: { flexDirection: 'row', marginBottom: 12 },
  userMessageAlign: { justifyContent: 'flex-end' },
  otherMessageAlign: { justifyContent: 'flex-start' },
  
  messageContainer: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userMessageCard: { backgroundColor: '#e3efff', borderBottomRightRadius: 2 },
  systemMessage: { 
    backgroundColor: '#eceff1', 
    alignSelf: 'center', 
    width: '95%', 
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#b0bec5',
    marginVertical: 10
  },
  systemText: { textAlign: 'center', fontStyle: 'italic', color: '#607d8b', fontSize: 13 },
  
  userName: { fontWeight: 'bold', fontSize: 12, color: '#ff743dff', marginBottom: 4 },
  messageText: { fontSize: 15, color: '#333', lineHeight: 20 },
  timestamp: { fontSize: 9, color: '#999', marginTop: 5, textAlign: 'right' },

  actionPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  panelTitle: { fontSize: 12, fontWeight: '800', color: '#bbb', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  chipsContainer: { gap: 12, paddingRight: 20 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff743dff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  chipText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});