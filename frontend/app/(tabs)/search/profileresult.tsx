import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import Ionicons from '@expo/vector-icons/Ionicons'; //install
import DateTimePicker from '@react-native-community/datetimepicker'; //install
import { Picker } from '@react-native-picker/picker'; //Install

import ProfileIcon from '../../../assets/images/profileicon.png'; //Import

export default function ProfileResult() {
const insets = useSafeAreaInsets();

  const handleAccept = () => {
      alert("Simulación: Solicitud aceptada");
  };
  const handleReject = () => {
      alert("Simulación: Solicitud rechazada");
  };
  const [habilidad, setHabilidad] = useState("React Native");
  const [modalidad, setModalidad] = useState("online");
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [textoFecha, setTextoFecha] = useState("");

  // Función para manejar el cambio de fecha
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || fecha;
    setMostrarPicker(Platform.OS === 'ios');
    setFecha(currentDate);

    const dia = currentDate.getDate().toString().padStart(2, '0');
    const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const anio = currentDate.getFullYear();
    setTextoFecha(`${dia} / ${mes} / ${anio}`);
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Sección Tarjeta Perfil */}
      <View style={styles.cardContainer}>
        {/* SECCIÓN IZQUIERDA: Imagen Perfil */}
        <View style={styles.leftColumn}>
          <Image source={ProfileIcon} style={styles.profileImage}/>
        </View>

        {/* SECCIÓN DERECHA: Información */}
        <View style={styles.rightColumn}>
          <View style={styles.skillsSection}>
            <Text style={styles.userName}>@UserAlias</Text>
            <Text style={styles.institution}>Duoc UC</Text>            
            <View style={styles.rankContainer}>
              <Ionicons name="ribbon-sharp" size={24} color="#FFD700" />
              <Text style={styles.rankText}>Oro</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Línea divisoria horizontal */}
      <View style={styles.innerDivider} />

    {/* Sección Tarjeta Información Solicitud (EDICIÓN) */}
      <View style={styles.requestContainer}>        
        {/* SECCIÓN IZQUIERDA: Campos para elegir */}
        <View style={styles.leftRequestColumn}>          
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Habilidad que buscas</Text>
            <TextInput 
              style={styles.inputEdit} 
              value={habilidad} 
              onChangeText={setHabilidad} 
              placeholder="Ej: React Native" 
            />
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Modalidad</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={modalidad}
                onValueChange={(itemValue) => setModalidad(itemValue)}
                style={styles.pickerSmall}>
                <Picker.Item label="Online" value="online" />
              </Picker>
            </View>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Fecha deseada</Text>
            <TouchableOpacity 
              style={styles.inputEdit} 
              onPress={() => setMostrarPicker(true)}
            >
              <Text style={styles.inputText}>{textoFecha || "Seleccionar..."}</Text>
            </TouchableOpacity>
          </View>

          {/* Componente invisible que se activa al presionar arriba */}
          {mostrarPicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              onChange={onChangeFecha}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* SECCIÓN DERECHA: Costo del servicio */}
        <View style={styles.rightRequestColumn}>
          <Text style={styles.tokenLabel}>Inversión</Text>
          <Ionicons name="ticket" size={40} color="#ff743dff" />
          <Text style={styles.tokenAmountNegative}>-50</Text>
          <Text style={styles.tokenSub}>Tokens</Text>
        </View>
      </View>
      
      {/* BOTÓN */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonAccept]} 
          onPress={handleAccept}
        >
          <Text style={styles.buttonText}>Enviar Solicitud</Text>
        </TouchableOpacity>
      </View>      
    </View>
  );
}

// Estilo Backgroud y Contenedores
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

// Estilo Container Tarjeta Perfil
cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  
  // COLUMNA IZQUIERDA
  leftColumn: {
    flex: 0.40,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingRight: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    marginBottom: 8,
  },

  // COLUMNA DERECHA
  rightColumn: {
    flex: 0.60,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  skillsSection: {
    flex: 1,
    paddingVertical: 5,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  institution: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  rankContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  rankText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B8860B',
  },

  // Línea divisoria horizontal
  innerDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },

  // Estilo Container Tarjeta Información Solicitud
  requestContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  // COLUMNA IZQUIERDA  
  leftRequestColumn: {
    flex: 0.65,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingRight: 15,
  },

  infoGroup: {
    marginBottom: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },

  inputEdit: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },

  pickerBorder: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 5,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  pickerSmall: {
    height: 50,
    width: '100%',
  },


  inputText: {
    fontSize: 14,
    color: '#333',
  },

  // COLUMNA DERECHA
  rightRequestColumn: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },

  tokenLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
  },

  tokenAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff743dff',
  },

  tokenAmountNegative: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4444',
  },

  tokenSub: {
    fontSize: 10,
    color: '#ff743dff',
    fontWeight: '600',
  },

  // Estilo Botón
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1, 
    marginHorizontal: 8, 
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonAccept: {
    backgroundColor: '#4CAF50',
  },
  buttonReject: {
    backgroundColor: '#ff743dff',
  },  
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});