import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileIcon from '../../../assets/images/profileicon.png';

import { getUserProfileRequest, getResenasByUsuarioRequest, type UserProfile, type ResenaItem } from '../../_utils/api';
import { getStoredUser, getToken } from '../../_utils/authStorage';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [resenas, setResenas] = useState<ResenaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'perfil' | 'resenas'>('perfil');

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          setLoading(true);
          const storedUser = await getStoredUser();
          const token = await getToken();
          if (!storedUser || !token) { setUser(null); return; }

          const [profile, resenasData] = await Promise.all([
            getUserProfileRequest(token, storedUser.id),
            getResenasByUsuarioRequest(storedUser.id),
          ]);

          setUser(profile);
          setResenas(resenasData ?? []);
        } catch (error) {
          console.error('Error cargando perfil:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      loadUser();
    }, [])
  );

  const navegarA = (ruta: any) => {
    router.replace('/(tabs)/profile');
    setTimeout(() => {
      router.push(ruta);
    }, 100);
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

  if (loading) {
    return (
      <View style={[globalStyles.containerApp, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[globalStyles.containerApp, { paddingTop: insets.top }]}>

      {/* Card perfil */}
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
            <Text style={styles.infoText}>Alias: @{user?.alias || '-'}</Text>
            <Text style={styles.infoText}>
              ⭐ {user?.reputacion ? Number(user.reputacion).toFixed(1) : '0.0'} · {resenas.length} reseña{resenas.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={globalStyles.innerDivider} />

          <View style={globalStyles.skillsSection}>
            <Text style={styles.skillLabel}>OFRECE:</Text>
            <View style={styles.tagWrapper}>
              {user?.ofrezco?.length ? (
                user.ofrezco.map((skill) => (
                  <Text key={skill.id} style={styles.skillTag}>{skill.nombre}</Text>
                ))
              ) : (
                <Text style={styles.emptyText}>Sin habilidades</Text>
              )}
            </View>
          </View>

          <View style={globalStyles.innerDivider} />

          <View style={globalStyles.skillsSection}>
            <Text style={styles.skillLabel}>BUSCA:</Text>
            <View style={styles.tagWrapper}>
              {user?.busco?.length ? (
                user.busco.map((skill) => (
                  <Text key={skill.id} style={styles.skillTag}>{skill.nombre}</Text>
                ))
              ) : (
                <Text style={styles.emptyText}>Sin habilidades</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Tabs perfil / reseñas */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'perfil' && styles.tabActivo]}
          onPress={() => setSelectedTab('perfil')}
        >
          <Text style={[styles.tabText, selectedTab === 'perfil' && styles.tabTextActivo]}>
            Opciones
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

      {selectedTab === 'perfil' && (
        <View style={globalStyles.contentSectionA}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navegarA('/(tabs)/profile/configuration')}>
            <Ionicons name="settings-sharp" size={28} color="black" />
            <Text>Ajustes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => navegarA('/(tabs)/profile/skills')}>
            <Ionicons name="clipboard-sharp" size={28} color="black" />
            <Text>Habilidades</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => navegarA('/(tabs)/profile/editprofile')}>
            <Ionicons name="create-sharp" size={28} color="black" />
            <Text>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => navegarA('/(tabs)/profile/statistics')}>
            <Ionicons name="bar-chart-sharp" size={28} color="black" />
            <Text>Estadisticas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => navegarA('/(tabs)/profile/record')}>
            <Fontisto name="history" size={28} color="black" />
            <Text>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => navegarA('/(tabs)/profile/token')}>
            <FontAwesome6 name="coins" size={28} color="black" />
            <Text>Tokens</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => navegarA('/(tabs)/profile/translator')}>
            <Ionicons name="language" size={28} color="black" />
            <Text>Traductor</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedTab === 'resenas' && (
        <View style={styles.resenasContainer}>
          {resenas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="star-outline" size={60} color="#ccc" />
              <Text style={{ color: '#999', marginTop: 10 }}>Aún no tienes reseñas</Text>
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
    color: '#222',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#777',
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
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
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
});