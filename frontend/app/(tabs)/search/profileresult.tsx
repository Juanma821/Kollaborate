import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ProfileIcon from '../../../assets/images/profileicon.png';

import {
  createSolicitudRequest,
  getMatchProfileRequest,
  type MatchProfile,
} from '../../_utils/api';
import { getToken } from '../../_utils/authStorage';

export default function ProfileResult() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [habilidadId, setHabilidadId] = useState('');
  const [modalidad, setModalidad] = useState('online');
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [textoFecha, setTextoFecha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const token = await getToken();
        if (!token || !id) return;

        const data = await getMatchProfileRequest(token, Number(id));
        setProfile(data);

        if (data.ofrezco.length > 0) {
          setHabilidadId(String(data.ofrezco[0].id));
        }
      } catch (error) {
        console.error('Error cargando perfil del match:', error);
        Alert.alert('Error', 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const onChangeFecha = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || fecha;
    setMostrarPicker(Platform.OS === 'ios');
    setFecha(currentDate);

    const dia = currentDate.getDate().toString().padStart(2, '0');
    const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const anio = currentDate.getFullYear();
    setTextoFecha(`${dia} / ${mes} / ${anio}`);
  };

  const handleSendSolicitud = async () => {
    try {
      const token = await getToken();

      if (!token || !profile || !habilidadId) {
        Alert.alert('Error', 'Faltan datos para enviar la solicitud');
        return;
      }

      const result = await createSolicitudRequest(token, {
        receptor_id: profile.id,
        habilidad_id: Number(habilidadId),
      });

      Alert.alert('Exito', result.message || 'Solicitud enviada');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo enviar la solicitud';
      Alert.alert('Error', message);
    }
  };

  const selectedSkill = profile?.ofrezco.find((s) => String(s.id) === habilidadId);

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      <View style={globalStyles.cardContainer}>
        <View style={globalStyles.leftColumn}>
          <Image source={ProfileIcon} style={globalStyles.profileImage} />
        </View>

        <View style={globalStyles.rightColumn}>
          <View style={globalStyles.skillsSection}>
            <Text style={globalStyles.userName}>@{profile?.alias || 'Usuario'}</Text>
            <Text style={globalStyles.institution}>{profile?.institucion_nombre || 'Sin institucion'}</Text>
            <View style={globalStyles.rankContainer}>
              <Ionicons name="ribbon-sharp" size={24} color="#FFD700" />
              <Text style={globalStyles.rankText}>{profile?.rol || 'estudiante'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={globalStyles.innerDivider} />

      <View style={globalStyles.requestContainer}>
        <View style={globalStyles.leftRequestColumn}>
          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Habilidad que buscas</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={habilidadId}
                onValueChange={(itemValue) => setHabilidadId(String(itemValue))}
                style={styles.pickerSmall}
              >
                {profile?.ofrezco.map((skill) => (
                  <Picker.Item key={skill.id} label={skill.nombre} value={String(skill.id)} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Modalidad</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={modalidad}
                onValueChange={(itemValue) => setModalidad(String(itemValue))}
                style={styles.pickerSmall}
              >
                <Picker.Item label="Online" value="online" />
                <Picker.Item label="Presencial" value="presencial" />
              </Picker>
            </View>
          </View>

          <View style={globalStyles.infoGroup}>
            <Text style={globalStyles.label}>Fecha deseada</Text>
            <TouchableOpacity
              style={styles.inputEdit}
              onPress={() => setMostrarPicker(true)}
            >
              <Text style={globalStyles.inputText}>{textoFecha || 'Seleccionar...'}</Text>
            </TouchableOpacity>
          </View>

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

        <View style={globalStyles.rightRequestColumn}>
          <Text style={globalStyles.tokenLabel}>Inversion</Text>
          <Ionicons name="ticket" size={40} color="#ff743dff" />
          <Text style={styles.tokenAmountNegative}>-50</Text>
          <Text style={globalStyles.tokenSub}>Tokens</Text>
          <Text style={styles.skillPreview}>{selectedSkill?.nombre || 'Sin habilidad'}</Text>
        </View>
      </View>

      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonAccept]}
          onPress={handleSendSolicitud}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? 'Cargando...' : 'Enviar Solicitud'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  skillPreview: {
    marginTop: 10,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
