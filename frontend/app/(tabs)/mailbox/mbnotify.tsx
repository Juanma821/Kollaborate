import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import Ionicons from '@expo/vector-icons/Ionicons'; //install
import ProfileIcon from '../../../assets/images/profileicon.png'; //Import

export default function Mbnotify() {
const insets = useSafeAreaInsets();

  const handleAccept = () => {
      alert("Simulación: Solicitud aceptada");
  };
  const handleReject = () => {
      alert("Simulación: Solicitud rechazada");
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

{/* Sección Tarjeta Información Solicitud */}
      <View style={globalStyles.requestContainer}>
        
        {/* SECCIÓN IZQUIERDA: Datos de la Solicitud (Solo lectura) */}
        <View style={globalStyles.leftRequestColumn}>
          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Habilidad Solicitada</Text>
            <Text style={globalStyles.infoValue}>React Native</Text> 
          </View>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Modalidad</Text>
            <Text style={globalStyles.infoValue}>Online</Text>
          </View>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Fecha Propuesta</Text>
            <Text style={globalStyles.infoValue}>25 / 04 / 2026</Text>
          </View>
        </View>

        {/* SECCIÓN DERECHA: Ganancia de Tokens */}
        <View style={globalStyles.rightRequestColumn}>
          <Text style={globalStyles.tokenLabel}>Obtendrás</Text>
          <Ionicons name="ticket" size={40} color="#ff743dff" />
          <Text style={globalStyles.tokenAmount}>+50</Text>
          <Text style={globalStyles.tokenSub}>Tokens</Text>
        </View>

      </View>
      
      {/* BOTÓN */}
      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity 
          style={[globalStyles.button, {backgroundColor: Colors.success}]} 
          onPress={handleAccept}
        >
          <Text style={globalStyles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[globalStyles.button, {backgroundColor: Colors.error}]} 
          onPress={handleReject}
        >
          <Text style={globalStyles.buttonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>      
    </View>
  );
}
