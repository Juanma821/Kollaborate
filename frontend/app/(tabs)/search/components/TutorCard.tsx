import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface TutorCardProps {
  id: number;
  name: string;
  skill: string;
  rating: 'Oro' | 'Plata' | 'Bronce';
  profileImage?: string;
  costPerSession?: number;
  onViewProfile: (tutorId: number, tutorName: string) => void;
}

const getRatingColor = (rating: string): string => {
  switch (rating) {
    case 'Oro':
      return '#FFD700';
    case 'Plata':
      return '#C0C0C0';
    case 'Bronce':
      return '#CD7F32';
    default:
      return '#999';
  }
};

const getRatingStars = (rating: string): number => {
  switch (rating) {
    case 'Oro':
      return 5;
    case 'Plata':
      return 4;
    case 'Bronce':
      return 3;
    default:
      return 3;
  }
};

export default function TutorCard({
  id,
  name,
  skill,
  rating,
  profileImage,
  costPerSession = 50,
  onViewProfile,
}: TutorCardProps) {
  const ratingColor = getRatingColor(rating);
  const stars = getRatingStars(rating);

  return (
    <View style={styles.cardContainer}>
      {/* Imagen del Perfil */}
      <View style={styles.imageSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholderImage]}>
            <Ionicons name="person" size={40} color="#999" />
          </View>
        )}
      </View>

      {/* Información */}
      <View style={styles.infoSection}>
        <Text style={styles.tutorName}>{name}</Text>
        <Text style={styles.skill}>{skill}</Text>

        {/* Calificación */}
        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < stars ? 'star-sharp' : 'star-outline'}
              size={16}
              color={ratingColor}
              style={styles.star}
            />
          ))}
          <Text style={[styles.ratingText, { color: ratingColor }]}>
            {rating}
          </Text>
        </View>

        {/* Costo */}
        <View style={styles.costContainer}>
          <Ionicons name="ticket" size={16} color="#ff743dff" />
          <Text style={styles.costText}>{costPerSession} tokens/sesión</Text>
        </View>
      </View>

      {/* Botón Ver Perfil */}
      <TouchableOpacity
        style={styles.viewProfileButton}
        onPress={() => onViewProfile(id, name)}
      >
        <Text style={styles.buttonText}>Ver Perfil</Text>
        <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  imageSection: {
    marginRight: 12,
  },

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
  },

  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoSection: {
    flex: 1,
    justifyContent: 'space-between',
  },

  tutorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  skill: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  star: {
    marginRight: 2,
  },

  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  costText: {
    fontSize: 11,
    color: '#ff743dff',
    marginLeft: 4,
    fontWeight: '500',
  },

  viewProfileButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    gap: 4,
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
