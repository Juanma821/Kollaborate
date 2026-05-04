import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';
import { getToken } from '../../_utils/authStorage';
import { getMensajesRequest, enviarMensajeRequest } from '../../_utils/api';

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

  const cargarMensajes = useCallback(async (isFirstLoad = false) => {
    try {
      const token = await getToken();
      if (token) {
        if (isFirstLoad) {
          const decoded: any = jwtDecode(token);
          setMyId(decoded.id);
        }

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
      if (isFirstLoad) setLoading(false);
    }
  }, [sesionId]);

  useEffect(() => {
    cargarMensajes(true);

    const interval = setInterval(() => {
      cargarMensajes(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [cargarMensajes]);

  const sendAction = async (texto: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      // Envío al servidor
      await enviarMensajeRequest(token, Number(sesionId), texto);

      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        emisor_id: myId,
        text: texto,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      
      cargarMensajes(false);
    } catch (error: any) {
      Alert.alert("Error", "No se pudo enviar la respuesta rápida.");
    }
  };

const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.emisor_id === myId;

    return (
      <View style={[
        styles.messageWrapper, 
        isMine ? styles.userMessageAlign : styles.otherMessageAlign
      ]}>
        <View style={[
          styles.messageContainer, 
          isMine ? styles.userMessageCard : styles.otherMessageCard
        ]}>
          <Text style={[
            styles.messageText, 
            isMine ? styles.userMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isMine && { textAlign: 'right' }]}>
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
          onContentSizeChange={() => messages.length > 0} 
        />
      )}

      {/* Acciones Rápidas */}
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

          <TouchableOpacity style={[styles.chip, { backgroundColor: '#4CAF50' }]} onPress={() => sendAction('✔️ Sí')}>
            <Ionicons name="checkmark-circle-outline" size={18} color={Colors.textLight} />
            <Text style={styles.chipText}>Aceptar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, { backgroundColor: '#F44336' }]} onPress={() => sendAction('❌ No')}>
            <Ionicons name="close-circle-outline" size={18} color={Colors.textLight} />
            <Text style={styles.chipText}>Denegar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, { backgroundColor: '#2196F3' }]} onPress={() => sendAction('✅ ¡Detalles confirmados!')}>
            <Ionicons name="checkmark-done-circle-outline" size={18} color={Colors.textLight} />
            <Text style={styles.chipText}>Confirmar</Text>
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
    padding: 15,
  },
  messageWrapper: {
    marginBottom: 12,
    width: '100%',
  },
  userMessageAlign: {
    alignItems: 'flex-end',
  },
  otherMessageAlign: {
    alignItems: 'flex-start', 
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  // Estilo para mensajes (Derecha)
  userMessageCard: {
    backgroundColor: '#DCF8C6', 
    borderBottomRightRadius: 2, 
  },
  // Estilo para mensajes (Izquierda)
  otherMessageCard: {
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 2, 
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#000000',
  },
  otherMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 10,
    color: '#8e8e93',
    marginTop: 4,
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
    color: Colors.TextprimaryDark,
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