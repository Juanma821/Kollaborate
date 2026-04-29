import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, Platform, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';
import { getToken } from '../../_utils/authStorage';
import { getMensajesRequest, enviarMensajeRequest } from '../../_utils/api';

// Definición de tipos para TypeScript
interface Message {
  id: string;
  emisor_id: number | null;
  text: string;
  created_at: string;
}

export default function MBChat() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const sesionId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const token = await getToken();
        if (token) {
          const decoded: any = jwtDecode(token);
          setMyId(decoded.id);

          const data = await getMensajesRequest(token, Number(sesionId));

          const formattedMessages = data.map((m: any) => ({
            id: m.id.toString(),
            emisor_id: m.emisor_id,
            text: m.text || m.contenido,
            created_at: m.created_at
          }));

          setMessages(formattedMessages);
        }
      } catch (error: any) {
        console.error("Error cargando chat:", error.message);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [sesionId]);

  const sendAction = async (texto: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      await enviarMensajeRequest(token, Number(sesionId), texto);

      const newMessage: Message = {
        id: Date.now().toString(),
        emisor_id: myId,
        text: texto,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error: any) {
      Alert.alert("Error", "No se pudo enviar la respuesta rápida.");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.emisor_id === myId;
    return (
      <View style={[styles.messageWrapper, isMine ? styles.userMessageAlign : styles.otherMessageAlign]}>
        <View style={[styles.messageContainer, isMine && styles.userMessageCard]}>
          <Text style={[styles.messageText, isMine && { color: '#000' }]}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.containerApp}>
      <Stack.Screen options={{
        title: (Array.isArray(params.nombreChat) ? params.nombreChat[0] : params.nombreChat) || 'Acuerdo de Sesión'
      }} />

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />
      )}

      {/* Acciones Rápidas - Sin Picker conflictivo */}
      <View style={[styles.actionPanel, { paddingBottom: insets.bottom + 10 }]}>
        <Text style={styles.panelTitle}>Sugerir Acuerdo:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>

          <TouchableOpacity style={styles.chip} onPress={() => sendAction('📍 Propongo usar Google Meet / Zoom')}>
            <Ionicons name="videocam-outline" size={18} color={Colors.textLight} />
            <Text style={styles.chipText}>Link Reunión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chip} onPress={() => sendAction('📝 ¿Hay algún material previo?')}>
            <Ionicons name="document-text-outline" size={18} color={Colors.textLight} />
            <Text style={styles.chipText}>Materiales</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, { backgroundColor: Colors.positiveBg }]} onPress={() => sendAction('✔️ Acepto la propuesta')}>
            <Ionicons name="checkmark-circle-outline" size={18} color={Colors.textLight} />
            <Text style={styles.chipText}>Aceptar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, { backgroundColor: Colors.negativeBg }]} onPress={() => sendAction('❌ No puedo en ese horario')}>
            <Ionicons name="close-circle-outline" size={18} color={Colors.textLight} />
            <Text style={styles.chipText}>Denegar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, { backgroundColor: Colors.confirmBg }]} onPress={() => sendAction('✅ ¡Detalles confirmados!')}>
            <Ionicons name="checkmark-done-circle-outline" size={18} color={Colors.textLight} />
            <Text style={styles.chipText}>Confirmar Acuerdo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

// Estilos Propios
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5'
  },
  //Mensajes
  messagesList: {
    padding: 16
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 12
  },
  userMessageAlign: {
    justifyContent: 'flex-end'
  },
  otherMessageAlign: {
    justifyContent: 'flex-start'
  },
  messageContainer: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 15,
    backgroundColor: Colors.card,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userMessageCard: {
    backgroundColor: '#e3efff',
    borderBottomRightRadius: 2
  },
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
  systemText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#607d8b',
    fontSize: 13
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 4
  },
  messageText: {
    fontSize: 15,
    color: Colors.textDark,
    lineHeight: 20
  },
  timestamp: {
    fontSize: 9,
    color: Colors.textLabel,
    marginTop: 5,
    textAlign: 'right'
  },
  // Panel de acciones
  actionPanel: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#bbb',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  chipsContainer: {
    gap: 12,
    paddingRight: 20
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colorCard,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  chipText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '600'
  },
});