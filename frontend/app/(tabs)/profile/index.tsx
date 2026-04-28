import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileIcon from '../../../assets/images/profileicon.png';
import { getStoredUser } from '../../_utils/authStorage';

type ProfileUser = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  alias: string;
  rol?: string;
  institucion_id?: number | null;
  institucion_nombre?: string | null;
};

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          setLoading(true);
          const storedUser = await getStoredUser();
          setUser(storedUser);
        } finally {
          setLoading(false);
        }
      };

      loadUser();
    }, [])
  );

  if (loading) {
    return (
      <View style={[globalStyles.containerApp, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      <View style={globalStyles.cardContainer}>
        <View style={styles.leftColumn}>
          <Image source={ProfileIcon} style={styles.profileImage} />
          <Text style={globalStyles.userName}>@{user?.alias || 'Usuario'}</Text>
          <Text style={globalStyles.institution}>
                {user?.institucion_nombre || user?.email || 'Sin datos'}
          </Text>
          <View style={globalStyles.rankContainer}>
            <Ionicons name="ribbon-sharp" size={24} color="#FFD700" />
            <Text style={globalStyles.rankText}>{user?.rol || 'estudiante'}</Text>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View style={globalStyles.skillsSection}>
            <Text style={styles.nameText}>
              {user ? `${user.nombre} ${user.apellido}` : 'Sin datos'}
            </Text>
            <Text style={styles.infoText}>ID: {user?.id ?? '-'}</Text>
            <Text style={styles.infoText}>Alias: @{user?.alias || '-'}</Text>
            <Text style={styles.infoText}>Correo: {user?.email || '-'}</Text>
          </View>

          <View style={globalStyles.innerDivider} />

          <View style={globalStyles.skillsSection}>
            <Text style={styles.skillLabel}>ESTADO:</Text>
            <View style={styles.tagWrapper}>
              <Text style={styles.skillTag}>Sesion iniciada</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={globalStyles.contentSectionA}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/configuration')}>
          <Ionicons name="settings-sharp" size={28} color="black" />
          <Text>Ajustes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/skills')}>
          <Ionicons name="clipboard-sharp" size={28} color="black" />
          <Text>Habilidades</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/editprofile')}>
          <Ionicons name="create-sharp" size={28} color="black" />
          <Text>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/statistics')}>
          <Ionicons name="bar-chart-sharp" size={28} color="black" />
          <Text>Estadisticas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/record')}>
          <Fontisto name="history" size={28} color="black" />
          <Text>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/profile/token')}>
          <FontAwesome6 name="coins" size={28} color="black" />
          <Text>Tokens</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leftColumn: {
    flex: 0.35,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
    paddingRight: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.borderDefault,
    marginBottom: 8,
  },
  rightColumn: {
    flex: 0.65,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  skillLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    fontSize: 11,
    backgroundColor: Colors.input,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    color: '#444',
  },
  iconButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
});
