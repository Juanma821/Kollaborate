import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; //Install
import { useRouter } from 'expo-router'; //Install
import { Ionicons } from '@expo/vector-icons'; //Install

export default function Mailbox() {
  const [selectedTab, setSelectedTab] = useState('request');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Estados para el Modal de Respuesta
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRespuesta, setSelectedRespuesta] = useState<any>(null);

  // Datos de ejemplo
  const solicitudes = [
    { id: 1, usuario: 'Pedro Picapiedra', habilidad: 'Clases de Piano', fecha: 'hace 5 min' },
  ];

  const respuestas = [
    { id: 2, usuario: 'Maria José', habilidad: 'Node.js', estado: 'Aceptado', fecha: '14:40' },
    { id: 3, usuario: 'Carlos Ruiz', habilidad: 'Python', estado: 'Rechazado', fecha: 'Ayer' },
  ];

  const mensajes = [
    { id: 101, usuario: 'Maria José', ultimoMensaje: 'Mensaje', fecha: '12:30' },
  ];

  // Función abrir modal
  const abrirResolucion = (item: any) => {
    setSelectedRespuesta(item);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Selector de 3 Botones */}
      <View style={styles.selectorContainer}>
        {['request', 'reply', 'message'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.selectorButton, selectedTab === tab && styles.selectorButtonActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.selectorText, selectedTab === tab && styles.selectorTextActive]}>
              {tab === 'request' ? 'Solicitudes' : tab === 'reply' ? 'Respuestas' : 'Chats'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>
          {selectedTab === 'request' ? 'Nuevas Solicitudes' : selectedTab === 'reply' ? 'Resolución de Solicitudes' : 'Conversaciones'}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Lógica por pestaña */}
          {selectedTab === 'request' && solicitudes.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.listItem}
              onPress={() => router.push({ pathname: '/(tabs)/mailbox/mbnotify', params: { id: item.id, usuario: item.usuario }})}
            >
              <View style={styles.avatarPlaceholder}><Ionicons name="person-outline" size={24} color="#666" /></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemTitle}>{item.usuario}</Text>
                <Text style={styles.itemSub}>{item.habilidad}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ddd" />
            </TouchableOpacity>
          ))}

          {selectedTab === 'reply' && respuestas.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.listItem}
              onPress={() => abrirResolucion(item)}
            >
              <View style={[styles.avatarPlaceholder, { backgroundColor: item.estado === 'Aceptado' ? '#e8f5e9' : '#ffebee' }]}>
                <Ionicons 
                  name={item.estado === 'Aceptado' ? 'checkmark-circle' : 'close-circle'} 
                  size={24} 
                  color={item.estado === 'Aceptado' ? '#4caf50' : '#f44336'} 
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemTitle}>{item.usuario}</Text>
                <Text style={[styles.itemSub, { color: item.estado === 'Aceptado' ? '#4caf50' : '#f44336' }]}>{item.estado}</Text>
              </View>
              <Ionicons name="eye-outline" size={20} color="#ddd" />
            </TouchableOpacity>
          ))}

          {selectedTab === 'message' && mensajes.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.listItem}
              onPress={() => router.push({ pathname: '/(tabs)/mailbox/mbchat', params: { id: item.id, nombreChat: item.usuario }})}
            >
              <View style={styles.avatarPlaceholder}><Ionicons name="chatbubbles-outline" size={24} color="#ff743dff" /></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemTitle}>{item.usuario}</Text>
                <Text style={styles.itemSub}>{item.ultimoMensaje}</Text>
                <Text style={styles.itemDate}>{item.fecha}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ddd" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal Respuesta */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resultado de Solicitud</Text>
            {selectedRespuesta && (
              <>
                <Text style={styles.modalText}>Para: <Text style={{fontWeight: 'bold'}}>{selectedRespuesta.usuario}</Text></Text>
                <Text style={styles.modalText}>Habilidad: {selectedRespuesta.habilidad}</Text>
                <View style={[styles.statusBadge, { backgroundColor: selectedRespuesta.estado === 'Aceptado' ? '#4caf50' : '#f44336' }]}>
                  <Text style={styles.statusBadgeText}>{selectedRespuesta.estado}</Text>
                </View>

                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: selectedRespuesta.estado === 'Aceptado' ? '#ff743dff' : '#666' }]}
                  onPress={() => {
                    setModalVisible(false);
                    if(selectedRespuesta.estado === 'Aceptado') router.push('/(tabs)/mailbox/mbchat');
                  }}
                >
                  <Text style={styles.modalButtonText}>
                    {selectedRespuesta.estado === 'Aceptado' ? 'Ir al Chat' : 'Entendido / Finalizar'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

//Estilos
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  // Selector de Pestañas
  selectorContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    marginTop: 20, 
    borderRadius: 12, 
    padding: 4, 
    elevation: 2 
  },
  selectorButton: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  selectorButtonActive: { 
    backgroundColor: '#ff743dff' 
  },
  selectorText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#666' 
  },
  selectorTextActive: {
     color: '#fff' 
    },

  //Contenido Sección  
  contentSection: { 
    flex: 1, 
    marginTop: 25, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    paddingHorizontal: 20, 
    paddingTop: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#333', 
    marginBottom: 15,
    textAlign: 'center'    
  },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
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
    color: '#666' 
  },
  itemDate: { 
    fontSize: 11, 
    color: '#aaa', 
    marginRight: 10 
  },
  
  // Estilos del Modal
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '80%', 
    backgroundColor: '#fff', 
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
  statusBadge: { 
    paddingHorizontal: 20, 
    paddingVertical: 5, 
    borderRadius: 20, 
    marginVertical: 15 
  },
  statusBadgeText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  modalButton: { 
    width: '100%', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10 
  },
  modalButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});