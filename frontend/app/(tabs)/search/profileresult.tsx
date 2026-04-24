import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {Image,StyleSheet,Text,TextInput,TouchableOpacity,View,Platform,ActivityIndicator,Alert,} from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

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
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      
      {/* Sección Tarjeta Perfil */}
      <View style={globalStyles.cardContainer}>
        {/* SECCIÓN IZQUIERDA: Imagen Perfil */}
        <View style={globalStyles.leftColumn}>
          <Image source={ProfileIcon} style={globalStyles.profileImage}/>
        </View>

        {/* SECCIÓN DERECHA: Información */}
        <View style={globalStyles.rightColumn}>
          <View style={globalStyles.skillsSection}>
            <Text style={globalStyles.userName}>@UserAlias</Text>
            <Text style={globalStyles.institution}>Duoc UC</Text>            
            <View style={globalStyles.rankContainer}>
              <Ionicons name="ribbon-sharp" size={24} color="#FFD700" />
              <Text style={globalStyles.rankText}>Oro</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Línea divisoria horizontal */}
      <View style={globalStyles.innerDivider} />

    {/* Sección Tarjeta Información Solicitud (EDICIÓN) */}
      <View style={globalStyles.requestContainer}>        
        {/* SECCIÓN IZQUIERDA: Campos para elegir */}
        <View style={globalStyles.leftRequestColumn}>          
          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Habilidad que buscas</Text>
            <TextInput 
              style={styles.inputEdit} 
              value={habilidad} 
              onChangeText={setHabilidad} 
              placeholder="Ej: React Native" 
            />
          </View>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Modalidad</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={modalidad}
                onValueChange={(itemValue) => setModalidad(itemValue)}
                style={styles.pickerSmall}>
                <Picker.Item label="Online" value="online" />
              </Picker>
            </View>
          </View>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Fecha deseada</Text>
            <TouchableOpacity 
              style={styles.inputEdit} 
              onPress={() => setMostrarPicker(true)}
            >
              <Text style={globalStyles.inputText}>{textoFecha || "Seleccionar..."}</Text>
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
        <View style={globalStyles.rightRequestColumn}>
          <Text style={globalStyles.tokenLabel}>Inversión</Text>
          <Ionicons name="ticket" size={40} color="#ff743dff" />
          <Text style={styles.tokenAmountNegative}>-50</Text>
          <Text style={globalStyles.tokenSub}>Tokens</Text>
        </View>
      </View>
      
      {/* BOTÓN */}
      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity 
          style={[globalStyles.button, globalStyles.buttonAccept]} 
          onPress={handleAccept}
        >
          <Text style={globalStyles.buttonText}>Enviar Solicitud</Text>
        </TouchableOpacity>
      </View>      
    </View>
  );
}

// Estilo Propio
const styles = StyleSheet.create({
  //Container Tarjeta Información Solicitud
  inputEdit: {
    backgroundColor: Colors.input,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    fontSize: 14,
    color: Colors.textDark,
    marginTop: 5,
  },
  pickerBorder: {
    backgroundColor: Colors.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginTop: 5,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  pickerSmall: {
    height: 50,
    width: '100%',
  },
  tokenAmountNegative: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4444',
  },

});