import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'; //install
import Fontisto from '@expo/vector-icons/Fontisto'; //install
import Ionicons from '@expo/vector-icons/Ionicons'; //install
import ProfileIcon from '../../../assets/images/profileicon.png';




export default function Profile() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Sección Tarjeta Perfil */}
      <View style={styles.cardContainer}>
      {/* SECCIÓN IZQUIERDA: Identificación básica */}
      <View style={styles.leftColumn}>
        <Image source={ProfileIcon} style={styles.profileImage}/>
        <Text style={styles.userName}>@UserAlias</Text>
        <Text style={styles.institution}>Duoc UC</Text>
        
        {/* Rango/Medalla */}
        <View style={styles.rankContainer}>
          <Ionicons name="ribbon-sharp" size={24} color="#FFD700" />
          <Text style={styles.rankText}>Oro</Text>
        </View>
      </View>

      {/* SECCIÓN DERECHA: Habilidades */}
      <View style={styles.rightColumn}>
        
        {/* Sub-sección Arriba: Ofrece */}
        <View style={styles.skillsSection}>
          <Text style={styles.skillLabel}>OFRECE:</Text>
          <View style={styles.tagWrapper}>
            <Text style={styles.skillTag}>React</Text>
            <Text style={styles.skillTag}>UX/UI</Text>
          </View>
        </View>

        {/* Línea divisoria interna horizontal */}
        <View style={styles.innerDivider} />

        {/* Sub-sección Abajo: Busca */}
        <View style={styles.skillsSection}>
          <Text style={styles.skillLabel}>BUSCA:</Text>
          <View style={styles.tagWrapper}>
            <Text style={styles.skillTag}>Node.js</Text>
            <Text style={styles.skillTag}>Python</Text>
          </View>
        </View>
        
      </View>
      </View>

      {/* Sección Opciones */}
      <View style={styles.contentSection}>
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
          <Text>Estadísticas</Text>
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
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  
  // COLUMNA IZQUIERDA
  leftColumn: {
    flex: 0.35,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingRight: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    marginBottom: 8,
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

  // COLUMNA DERECHA
  rightColumn: {
    flex: 0.65,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  skillsSection: {
    flex: 1,
    paddingVertical: 5,
  },
  skillLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ff743dff', 
    marginBottom: 5,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    fontSize: 11,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    color: '#444',
  },
  innerDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },

//Estilo Contenido Opciones
  contentSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 20,
  },
  iconButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',
    backgroundColor: '#fff', 
    borderRadius: 12,
  },
});