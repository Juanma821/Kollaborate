import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Alert, ActivityIndicator, RefreshControl } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../../_utils/authStorage';
import { getSolicitudesRecibidasRequest, getSolicitudesEnviadasRequest, getChatMatchesRequest, type SolicitudItem, type Match } from '../../_utils/api';

export default function Mailbox() {
  const [selectedTab, setSelectedTab] = useState<'request' | 'reply' | 'message'>('request');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRespuesta, setSelectedRespuesta] = useState<SolicitudItem | null>(null);

  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState<SolicitudItem[]>([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState<SolicitudItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Lógica de carga
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      if (selectedTab === 'request') {
        const data = await getSolicitudesRecibidasRequest(token);
        setSolicitudesRecibidas(Array.isArray(data) ? data : []);
      } else if (selectedTab === 'reply') {
        const data = await getSolicitudesEnviadasRequest(token);
        setSolicitudesEnviadas(Array.isArray(data) ? data : []);
      } else if (selectedTab === 'message') {
        const data = await getChatMatchesRequest(token);
        setMatches(Array.isArray(data) ? data : []);
      }
    } catch (error: any) {
      console.error('Error cargando Mailbox:', error.message);
      setSolicitudesRecibidas([]);
      setSolicitudesEnviadas([]);
      setMatches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const abrirModalRespuesta = (item: SolicitudItem) => {
    setSelectedRespuesta(item);
    setModalVisible(true);
  };

  const estadoTexto = (estadoId: number) => {
    const estados: Record<number, string> = { 1: 'Pendiente', 2: 'Aceptada', 3: 'Rechazada' };
    return estados[estadoId] || 'Desconocido';
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>

      {/* Pestañas */}
      <View style={styles.selectorContainer}>
        {(['request', 'reply', 'message'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[globalStyles.selectorButton, selectedTab === tab && globalStyles.selectorButtonActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[globalStyles.selectorText, selectedTab === tab && globalStyles.selectorTextActive]}>
              {tab === 'request' ? 'Solicitudes' : tab === 'reply' ? 'Respuestas' : 'Chats'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={globalStyles.contentSectionB}>
        <Text style={[globalStyles.sectionTitle, {color: Colors.TextprimaryDark}]}>
          {selectedTab === 'request' ? 'Nuevas Solicitudes' : selectedTab === 'reply' ? 'Mis Peticiones' : 'Mensajes'}
        </Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}
              refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
            }
          >
            {/* Solicitudes Recibidas */}
            {selectedTab === 'request' && solicitudesRecibidas.length === 0 && <Text style={styles.emptyText}>No tienes solicitudes nuevas.</Text>}
            {selectedTab === 'request' && solicitudesRecibidas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listItem}
                onPress={() => router.push({ pathname: '/(tabs)/mailbox/mbnotify', params: { id: item.id } })}
              >
                <View style={styles.avatarPlaceholder}><Ionicons name="person-outline" size={24} color={Colors.textMuted} /></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitle}>{item.usuario}</Text>
                  <Text style={styles.itemSub}>Quiere aprender: {item.habilidad}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMedium} />
              </TouchableOpacity>
            ))}

            {/* Notificaciones */}
            {selectedTab === 'reply' && solicitudesEnviadas.length === 0 && <Text style={styles.emptyText}>No tienes respuestas.</Text>}
            {selectedTab === 'reply' && solicitudesEnviadas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listItem}
                onPress={() => abrirModalRespuesta(item)}
              >
                <View style={[styles.avatarPlaceholder, { backgroundColor: item.estado_id === 2 ? '#e8f5e9' : '#f5f5f5' }]}>
                  <Ionicons
                    name={item.estado_id === 2 ? 'checkmark-circle' : item.estado_id === 3 ? 'close-circle' : 'time-outline'}
                    size={24}
                    color={item.estado_id === 2 ? '#4caf50' : item.estado_id === 3 ? '#f44336' : '#999'}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitle}>{item.usuario}</Text>
                  <Text style={styles.itemSub}>{item.habilidad}</Text>
                  <Text style={[styles.itemDate, { color: item.estado_id === 2 ? Colors.success : Colors.textMuted }]}>
                    {estadoTexto(item.estado_id)}
                  </Text>
                </View>
                <Ionicons name="eye-outline" size={20} color={Colors.textMediumLight} />
              </TouchableOpacity>
            ))}

            {/* Chats */}
            {selectedTab === 'message' && matches.length === 0 && <Text style={styles.emptyText}>No tienes chats activos</Text>}
            {selectedTab === 'message' && matches.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listItem}
                onPress={() => router.push({ pathname: '/(tabs)/mailbox/mbchat', params: { id: item.id, nombreChat: item.nombreChat } })}
              >
                <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.primary + '20' }]}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitle}>{item.nombreChat}</Text>
                  <Text style={styles.itemSub}>Match por: {item.habilidad}</Text>
                </View>
                <View style={styles.onlineBadge} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Modal respuesta notificaciones */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={[globalStyles.modalOverlay, {alignItems: 'center'}]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Estado de tu Solicitud</Text>
            {selectedRespuesta && (
              <View style={{ marginVertical: 15 }}>
                <Text style={styles.modalText}>Para: <Text style={{ fontWeight: 'bold' }}>{selectedRespuesta.usuario}</Text></Text>
                <Text style={styles.modalText}>Habilidad: {selectedRespuesta.habilidad}</Text>
                <Text style={[styles.modalText, { marginTop: 10, color: selectedRespuesta.estado_id === 2 ? Colors.success : Colors.error }]}>
                  Resultado: {estadoTexto(selectedRespuesta.estado_id)}
                </Text>
                {selectedRespuesta.estado_id === 2 && (
                  <Text style={{ fontSize: 12, color: Colors.textMuted, fontStyle: 'italic', marginTop: 5 }}>
                    ¡Ya puedes encontrar a este usuario en la pestaña de Chats!
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity style={globalStyles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={globalStyles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

//Estilos Propios
const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 2
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  itemSub: {
    fontSize: 13,
    color: Colors.textMuted
  },
  itemDate: {
    fontSize: 11,
    color: Colors.textPlaceholder,
    marginRight: 10
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: Colors.textDark,
    fontSize: 15
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10
  },
  onlineBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: Colors.borderLight
  }
});
