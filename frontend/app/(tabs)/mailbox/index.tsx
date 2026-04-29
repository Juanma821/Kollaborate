import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Alert, ActivityIndicator } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { API_BASE_URL } from '../../_utils/api';

import {
  aceptarSolicitudRequest,
  getSolicitudesRequest,
  rechazarSolicitudRequest,
  type SolicitudItem,
} from '../../_utils/api';
import { getToken } from '../../_utils/authStorage';

export default function Mailbox() {
  const [selectedTab, setSelectedTab] = useState<'request' | 'reply' | 'message'>('request');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRespuesta, setSelectedRespuesta] = useState<SolicitudItem | null>(null);

  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState<SolicitudItem[]>([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState<SolicitudItem[]>([]);
  const [loading, setLoading] = useState(false);

  const mensajes: any[] = [];

  useFocusEffect(
  useCallback(() => {
    loadSolicitudes();
  }, [])
);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      console.log('🔑 Token:', token ? 'existe' : 'NO HAY TOKEN');
      console.log('🌐 API URL:', API_BASE_URL); 

      if (!token) return;

      const data = await getSolicitudesRequest(token);

      console.log('Solicitudes recibidas:', data.recibidas);
      console.log('Solicitudes enviadas:', data.enviadas);

      setSolicitudesRecibidas(data.recibidas ?? []);
      setSolicitudesEnviadas(data.enviadas ?? []);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirResolucion = (item: SolicitudItem) => {
    setSelectedRespuesta(item);
    setModalVisible(true);
  };

  const handleAceptar = async (id: number) => {
    try {
      const token = await getToken();
      if (!token) return;

      const result = await aceptarSolicitudRequest(token, id);
      Alert.alert('Exito', result.message || 'Solicitud aceptada');
      setModalVisible(false);
      await loadSolicitudes();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo aceptar la solicitud';
      Alert.alert('Error', message);
    }
  };

  const handleRechazar = async (id: number) => {
    try {
      const token = await getToken();
      if (!token) return;

      const result = await rechazarSolicitudRequest(token, id);
      Alert.alert('Exito', result.message || 'Solicitud rechazada');
      setModalVisible(false);
      await loadSolicitudes();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo rechazar la solicitud';
      Alert.alert('Error', message);
    }
  };

  const estadoTexto = (estadoId: number) => {
    if (estadoId === 1) return 'Pendiente';
    if (estadoId === 2) return 'Aceptada';
    if (estadoId === 3) return 'Rechazada';
    return 'Desconocido';
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      <View style={styles.selectorContainer}>
        {['request', 'reply', 'message'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[globalStyles.selectorButton, selectedTab === tab && globalStyles.selectorButtonActive]}
            onPress={() => setSelectedTab(tab as 'request' | 'reply' | 'message')}
          >
            <Text
              style={[
                globalStyles.selectorText,
                { fontSize: 12 },
                selectedTab === tab && globalStyles.selectorTextActive
              ]}
            >
              {tab === 'request' ? 'Solicitudes' : tab === 'reply' ? 'Respuestas' : 'Chats'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={globalStyles.contentSectionB}>
        <Text style={globalStyles.sectionTitle}>
          {selectedTab === 'request'
            ? 'Nuevas Solicitudes'
            : selectedTab === 'reply'
              ? 'Resolucion de Solicitudes'
              : 'Conversaciones'}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>

            {selectedTab === 'request' && solicitudesRecibidas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listItem}
                onPress={() => abrirResolucion(item)}
              >
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person-outline" size={24} color="#666" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitle}>{item.usuario}</Text>
                  <Text style={styles.itemSub}>{item.habilidad}</Text>
                  <Text style={styles.itemDate}>{estadoTexto(item.estado_id)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ddd" />
              </TouchableOpacity>
            ))}

            {selectedTab === 'reply' && solicitudesEnviadas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listItem}
                onPress={() => abrirResolucion(item)}
              >
                <View
                  style={[
                    styles.avatarPlaceholder,
                    {
                      backgroundColor:
                        item.estado_id === 2 ? '#e8f5e9'
                          : item.estado_id === 3 ? '#ffebee'
                            : '#f5f5f5'
                    }
                  ]}
                >
                  <Ionicons
                    name={
                      item.estado_id === 2
                        ? 'checkmark-circle'
                        : item.estado_id === 3
                          ? 'close-circle'
                          : 'time-outline'
                    }
                    size={24}
                    color={
                      item.estado_id === 2
                        ? '#4caf50'
                        : item.estado_id === 3
                          ? '#f44336'
                          : '#999'
                    }
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitle}>{item.usuario}</Text>
                  <Text style={styles.itemSub}>{item.habilidad}</Text>
                  <Text style={styles.itemDate}>{estadoTexto(item.estado_id)}</Text>
                </View>
                <Ionicons name="eye-outline" size={20} color="#ddd" />
              </TouchableOpacity>
            ))}

            {selectedTab === 'message' && mensajes.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
                <Text style={{ color: '#999', marginTop: 10 }}>Sin conversaciones aun</Text>
              </View>
            )}

            {!loading && selectedTab === 'request' && solicitudesRecibidas.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="mail-open-outline" size={60} color="#ccc" />
                <Text style={{ color: '#999', marginTop: 10 }}>No tienes solicitudes recibidas</Text>
              </View>
            )}

            {!loading && selectedTab === 'reply' && solicitudesEnviadas.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="send-outline" size={60} color="#ccc" />
                <Text style={{ color: '#999', marginTop: 10 }}>No has enviado solicitudes</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedTab === 'request' ? 'Resolver solicitud' : 'Detalle de solicitud'}
            </Text>

            {selectedRespuesta && (
              <>
                <Text style={styles.modalText}>
                  Usuario: <Text style={{ fontWeight: 'bold' }}>{selectedRespuesta.usuario}</Text>
                </Text>
                <Text style={styles.modalText}>Habilidad: {selectedRespuesta.habilidad}</Text>
                <Text style={styles.modalText}>Estado: {estadoTexto(selectedRespuesta.estado_id)}</Text>

                {selectedTab === 'request' && selectedRespuesta.estado_id === 1 ? (
                  <>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: '#4caf50' }]}
                      onPress={() => handleAceptar(selectedRespuesta.id)}
                    >
                      <Text style={styles.modalButtonText}>Aceptar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                      onPress={() => handleRechazar(selectedRespuesta.id)}
                    >
                      <Text style={styles.modalButtonText}>Rechazar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: Colors.colorCard }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
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
  modalButton: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  modalButtonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16
  }
});
