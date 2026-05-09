import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ProfileIcon from '../../../assets/images/profileicon.png';

import {
  createSolicitudRequest, getMatchProfileRequest,
  getResenasByUsuarioRequest, type MatchProfile, type ResenaItem
} from '../../_utils/api';
import { getToken } from '../../_utils/authStorage';

export default function ProfileResult() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const PRECIOS_NIVEL = {
    'Básico': 10,
    'Intermedio': 15,
    'Avanzado': 25,
    'Experto': 35
  };

  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [resenas, setResenas] = useState<ResenaItem[]>([]);
  const [habilidadId, setHabilidadId] = useState('');
  const [modalidad, setModalidad] = useState<'Online' | 'Presencial'>('Online');
  const [nivel, setNivel] = useState<'Básico' | 'Intermedio' | 'Avanzado' | 'Experto'>('Básico');
  const [fecha, setFecha] = useState(new Date());
  const [textoFecha, setTextoFecha] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'solicitud' | 'resenas'>('solicitud');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token || !id) return;

        const [data, resenasData] = await Promise.all([
          getMatchProfileRequest(token, Number(id)),
          getResenasByUsuarioRequest(Number(id)),
        ]);

        setProfile(data);
        setResenas(resenasData ?? []);

        if (data.ofrezco.length > 0) {
          setHabilidadId(String(data.ofrezco[0].id));
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        Alert.alert('Error', 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  const abrirCalendario = () => {
    DateTimePickerAndroid.open({
      value: fecha,
      mode: 'date',
      is24Hour: true,
      minimumDate: new Date(),
      onChange: (event, selectedDate) => {
        if (event.type === 'dismissed') return;
        if (selectedDate) {
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: 'time',
            is24Hour: true,
            onChange: (timeEvent, selectedTime) => {
              if (timeEvent.type === 'dismissed') return;
              if (selectedTime) {
                setFecha(selectedTime);
                const dia = selectedTime.getDate().toString().padStart(2, '0');
                const mes = (selectedTime.getMonth() + 1).toString().padStart(2, '0');
                const anio = selectedTime.getFullYear();
                const hora = selectedTime.getHours().toString().padStart(2, '0');
                const min = selectedTime.getMinutes().toString().padStart(2, '0');
                setTextoFecha(`${dia}/${mes}/${anio} ${hora}:${min} hrs`);
              }
            },
          });
        }
      },
    });
  };

  const costoActual = PRECIOS_NIVEL[nivel] || 10;

  const handleSendSolicitud = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token || !profile || !habilidadId) return;

      const anio = fecha.getFullYear();
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const dia = fecha.getDate().toString().padStart(2, '0');
      const horas = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');
      const fechaFormateadaOracle = `${anio}-${mes}-${dia} ${horas}:${minutos}:00`;

      await createSolicitudRequest(token, {
        receptor_id: profile.id,
        habilidad_id: Number(habilidadId),
        modalidad,
        nivel,
        fecha_propuesta: fechaFormateadaOracle,
        tokens_recompensa: costoActual
      });

      Alert.alert('Éxito', `Solicitud enviada. Costo: ${costoActual} tokens`);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderEstrellas = (cantidad: number) => (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Ionicons
          key={n}
          name={n <= cantidad ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      ))}
    </View>
  );

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading && !profile) {
    return (
      <View style={[globalStyles.containerApp, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[globalStyles.containerApp, { paddingTop: insets.top }]}>

      {/* Sección Perfil */}
      <View style={globalStyles.cardContainer}>
        <View style={globalStyles.leftColumn}>
          <Image source={ProfileIcon} style={globalStyles.profileImage} />
        </View>

        <View style={globalStyles.rightColumn}>
          <View style={globalStyles.skillsSection}>
            <Text style={globalStyles.userName}>@{profile?.alias || 'Cargando...'}</Text>
            <Text style={globalStyles.institution}>{profile?.institucion_nombre || 'Sin institución'}</Text>

            <View style={globalStyles.rankContainer}>
              <Text style={globalStyles.reputacionText}>
                ⭐ {profile?.reputacion ? profile.reputacion.toFixed(1) : '0.0'}
              </Text>
              <View style={[globalStyles.badge, { backgroundColor: Colors.secondary }]}>
                <Text style={globalStyles.badgeText}>{profile?.rol || 'Estudiante'}</Text>
              </View>
            </View>

            {/* Contador reseñas */}
            <Text style={styles.resenaCount}>
              {resenas.length} reseña{resenas.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      <View style={globalStyles.innerDivider} />

      {/* Tabs solicitud / reseñas */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'solicitud' && styles.tabActivo]}
          onPress={() => setSelectedTab('solicitud')}
        >
          <Text style={[styles.tabText, selectedTab === 'solicitud' && styles.tabTextActivo]}>
            Solicitar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'resenas' && styles.tabActivo]}
          onPress={() => setSelectedTab('resenas')}
        >
          <Text style={[styles.tabText, selectedTab === 'resenas' && styles.tabTextActivo]}>
            Reseñas ({resenas.length})
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'solicitud' && (
        <>
          <View style={globalStyles.requestContainer}>
            <View style={globalStyles.leftRequestColumn}>

              <View style={globalStyles.infoGroup}>
                <Text style={globalStyles.label}>Habilidad que solicitas</Text>
                <View style={styles.pickerBorder}>
                  <Picker
                    selectedValue={habilidadId}
                    onValueChange={(v) => setHabilidadId(v)}
                    style={styles.pickerSmall}
                  >
                    {profile?.ofrezco.map((skill) => (
                      <Picker.Item key={skill.id} label={skill.nombre} value={String(skill.id)} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={globalStyles.infoGroup}>
                <Text style={globalStyles.label}>Nivel y Modalidad</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={[styles.pickerBorder, { flex: 1.2 }]}>
                    <Picker
                      selectedValue={nivel}
                      onValueChange={(v) => setNivel(v)}
                      style={styles.pickerSmall}
                    >
                      <Picker.Item label="Básico" value="Básico" />
                      <Picker.Item label="Intermedio" value="Intermedio" />
                      <Picker.Item label="Avanzado" value="Avanzado" />
                      <Picker.Item label="Experto" value="Experto" />
                    </Picker>
                  </View>
                  <Text style={{ color: Colors.textDark }}>||</Text>
                  <View style={[styles.pickerBorder, { flex: 1 }]}>
                    <Picker
                      selectedValue={modalidad}
                      onValueChange={(v) => setModalidad(v)}
                      style={styles.pickerSmall}
                    >
                      <Picker.Item label="Online" value="Online" />
                      <Picker.Item label="Presencial" value="Presencial" />
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={globalStyles.infoGroup}>
                <Text style={globalStyles.label}>Fecha Propuesta</Text>
                <TouchableOpacity style={styles.dateSelector} onPress={abrirCalendario}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.primary} style={{ marginRight: 5 }} />
                  <Text style={styles.dateText}>{textoFecha || 'Seleccionar fecha y hora...'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={globalStyles.rightRequestColumn}>
              <Text style={globalStyles.tokenLabel}>Inversión</Text>
              <Ionicons name="ticket" size={42} color={Colors.secondary} />
              <Text style={[globalStyles.tokenAmount, { color: '#f44336' }]}>
                -{costoActual}
              </Text>
              <Text style={globalStyles.tokenSub}>Tokens</Text>
            </View>
          </View>

          <View style={globalStyles.buttonContainer}>
            <TouchableOpacity
              style={[globalStyles.button, { backgroundColor: Colors.primary, width: '100%' }]}
              onPress={handleSendSolicitud}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={globalStyles.buttonText}>Enviar Solicitud de Match</Text>
              }
            </TouchableOpacity>
          </View>
        </>
      )}

      {selectedTab === 'resenas' && (
        <View style={styles.resenasContainer}>
          {resenas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="star-outline" size={60} color="#ccc" />
              <Text style={{ color: '#999', marginTop: 10 }}>Sin reseñas aún</Text>
            </View>
          ) : (
            resenas.map(resena => (
              <View key={resena.id} style={styles.resenaCard}>
                <View style={styles.resenaHeader}>
                  <View style={styles.resenaAutor}>
                    <Ionicons name="person-circle-outline" size={36} color="#ccc" />
                    <View>
                      <Text style={styles.resenaAutorNombre}>{resena.autor}</Text>
                      <Text style={styles.resenaFecha}>{formatFecha(resena.fecha)}</Text>
                    </View>
                  </View>
                  {renderEstrellas(resena.calificacion)}
                </View>
                {resena.comentario && (
                  <Text style={styles.resenaComentario}>{resena.comentario}</Text>
                )}
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActivo: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActivo: {
    color: '#fff',
  },
  resenaCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  resenasContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  resenaCard: {
    backgroundColor: Colors.whiteBg,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  resenaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resenaAutor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resenaAutorNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  resenaFecha: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  resenaComentario: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F9F9F9',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textDark,
  },
});