import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Install
import { useRouter } from 'expo-router'; // Install
import { Ionicons } from '@expo/vector-icons'; // Install

export default function Mailbox() {
const [selectedTab, setSelectedTab] = useState('request');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Datos de ejemplo
  const solicitudes = [
    { id: 1, usuario: 'Pedro Picapiedra', habilidad: 'Clases de Piano', fecha: 'hace 5 min' },
    { id: 2, usuario: 'Ana Lista', habilidad: 'Matemáticas II', fecha: 'hace 1 hora' },
  ];

  const mensajes = [
    { id: 101, usuario: 'Juan Pérez', ultimoMensaje: '¡Dale, nos vemos mañana!', fecha: '12:30' },
    { id: 102, usuario: 'María Curiel', ultimoMensaje: '¿Te parece a las 15:00?', fecha: 'Ayer' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Seccion Boton Solicitud/Mensaje */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[styles.selectorButton, selectedTab === 'request' && styles.selectorButtonActive]}
          onPress={() => setSelectedTab('request')}
        >
          <Text style={[styles.selectorText, selectedTab === 'request' && styles.selectorTextActive]}>Solicitudes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.selectorButton, selectedTab === 'message' && styles.selectorButtonActive]}
          onPress={() => setSelectedTab('message')}
        >
          <Text style={[styles.selectorText, selectedTab === 'message' && styles.selectorTextActive]}>Mensajes</Text>
        </TouchableOpacity>
      </View>

      {/* Sección Contenido Solicitudes/ Mensajes */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>
          {selectedTab === 'request' ? 'Nuevas Solicitudes' : 'Conversaciones'}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedTab === 'request' ? (
            // REDIRECCIÓN DE SOLICITUDES
            solicitudes.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.listItem}
                onPress={() => router.push({
                pathname: '/(tabs)/mailbox/mbnotify',
                params: { id: item.id, usuario: item.usuario }})}>
                <View style={styles.avatarPlaceholder}>
                   <Ionicons name="person-circle-outline" size={40} color="#ccc" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitle}>{item.usuario}</Text>
                  <Text style={styles.itemSub}>{item.habilidad}</Text>
                </View>
                <Text style={styles.itemDate}>{item.fecha}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ddd" />
              </TouchableOpacity>
            ))
          ) : (
            // REDIRECCIÓN DE MENSAJES
            mensajes.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.listItem}
                onPress={() => router.push({
                pathname: '/(tabs)/mailbox/mbchat',
                params: { id: item.id, nombreChat: item.usuario }})}>
                <View style={styles.avatarPlaceholder}>
                   <Ionicons name="chatbubble-ellipses-outline" size={30} color="#ff743dff" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitle}>{item.usuario}</Text>
                  <Text style={styles.itemSub} numberOfLines={1}>{item.ultimoMensaje}</Text>
                </View>
                <Text style={styles.itemDate}>{item.fecha}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ddd" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}


// Estilo Backgroud y Contenedores
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  // Botones Solicitud/Mensaje
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
    fontWeight: '600', 
    color: '#666' 
  },
  selectorTextActive: { 
    color: '#fff' 
  },
  // Estilo de la sección de contenido
  contentSection: {
    flex: 1,
    marginTop: 25,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#333', 
    marginBottom: 15 
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  // Estilo de Avatar, Titulo, Subtitulo y Fecha
  avatarPlaceholder: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#f9f9f9', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  itemSub: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 2 
  },
  itemDate: { 
    fontSize: 11, 
    color: '#aaa', 
    marginRight: 10 
  },
});