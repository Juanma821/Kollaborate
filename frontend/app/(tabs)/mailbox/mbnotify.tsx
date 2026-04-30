import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';
import ProfileIcon from '../../../assets/images/profileicon.png';

import { getToken } from '../../_utils/authStorage';
import { aceptarSolicitudRequest, rechazarSolicitudRequest, API_BASE_URL } from '../../_utils/api';

export default function MBnotify() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [solicitud, setSolicitud] = useState<any>(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/solicitudes/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setSolicitud(data);
      } catch (error) {
        console.error("Error al obtener detalle:", error);
      }
    };
    fetchDetalle();
  }, [id]);

  // Formatear fecha
  const formatFecha = (fechaStr: string) => {
    if (!fechaStr) return 'No definida';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + " hrs";
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Básico': return '#4caf50';
      case 'Intermedio': return '#2196f3';
      case 'Avanzado': return '#ff7b00';
      case 'Experto': return '#9c27b0';
      default: return Colors.textMuted;
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      await aceptarSolicitudRequest(token!, Number(id));
      Alert.alert("¡Match logrado!", "La sesión ha sido programada con éxito.");
      router.replace('/mailbox');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      await rechazarSolicitudRequest(token!, Number(id));
      Alert.alert("Solicitud rechazada", "Se ha notificado al solicitante.");
      router.replace('/mailbox');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!solicitud && !loading) {
    return (
      <View style={[globalStyles.containerApp, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>

      {/* SECCIÓN PERFIL */}
      <View style={globalStyles.cardContainer}>
        <View style={globalStyles.leftColumn}>
          <Image source={ProfileIcon} style={globalStyles.profileImage} />
        </View>

        <View style={globalStyles.rightColumn}>
          <View style={globalStyles.skillsSection}>
            <Text style={globalStyles.userName}>{solicitud?.usuario || 'Cargando...'}</Text>
            <Text style={globalStyles.institution}>{solicitud?.institucion || 'Cargando...'}</Text>

            <View style={globalStyles.rankContainer}>
              <Text style={globalStyles.reputacionText}>
                ⭐ {solicitud?.reputacion_valor ? solicitud.reputacion_valor.toFixed(1) : '0.0'}
              </Text>

              <View style={[globalStyles.badge, { backgroundColor: solicitud?.nivel_color || '#CCC' }]}>
                <Text style={globalStyles.badgeText}>
                  {solicitud?.nivel_nombre || 'S/N'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={globalStyles.innerDivider} />

      {/* SECCIÓN INFORMACIÓN DE LA SOLICITUD */}
      <View style={globalStyles.requestContainer}>
        <View style={globalStyles.leftRequestColumn}>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Habilidad Solicitada</Text>
            <Text style={globalStyles.infoValue}>{solicitud?.habilidad}</Text>
          </View>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Nivel y Modalidad</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="stats-chart" size={14} color={getNivelColor(solicitud?.nivel)} />
                <Text style={[globalStyles.infoValue, { color: getNivelColor(solicitud?.nivel), marginLeft: 4, fontWeight: 'bold' }]}>
                  {solicitud?.nivel}
                </Text>
              </View>
              <Text style={{ color: Colors.textDark }}>||</Text>
              <Text style={globalStyles.infoValue}>{solicitud?.modalidad}</Text>
            </View>
          </View>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Fecha Programada</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primary} style={{ marginRight: 5 }} />
              <Text style={[globalStyles.infoValue, { color: Colors.textDark }]}>
                {formatFecha(solicitud?.fecha_propuesta)}
              </Text>
            </View>
          </View>

        </View>

        {/* SECCIÓN TOKENS */}
        <View style={globalStyles.rightRequestColumn}>
          <Text style={globalStyles.tokenLabel}>Recompensa</Text>
          <Ionicons name="ticket" size={42} color={Colors.secondary} />
          <Text style={globalStyles.tokenAmount}>+{solicitud?.tokens || 0}</Text>
          <Text style={globalStyles.tokenSub}>Tokens</Text>
        </View>
      </View>

      {/* BOTONES */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 30 }} />
      ) : (
        <View style={globalStyles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: Colors.buttonAccept }]}
            onPress={handleAccept}
          >
            <Text style={globalStyles.buttonText}>Aceptar Match</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: Colors.buttonReject }]}
            onPress={handleReject}
          >
            <Text style={globalStyles.buttonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}