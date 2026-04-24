import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // install
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'; //install
import Fontisto from '@expo/vector-icons/Fontisto'; //install
import Ionicons from '@expo/vector-icons/Ionicons'; //install
import ProfileIcon from '../../../assets/images/profileicon.png'; //Import




export default function Profile() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      
      {/* Sección Tarjeta Perfil */}
      <View style={globalStyles.cardContainer}>
        {/* SECCIÓN IZQUIERDA: Identificación básica */}
        <View style={styles.leftColumn}>
          <Image source={ProfileIcon} style={styles.profileImage}/>
          <Text style={globalStyles.userName}>@UserAlias</Text>
          <Text style={globalStyles.institution}>Duoc UC</Text>
        
          {/* Rango/Medalla */}
          <View style={globalStyles.rankContainer}>
            <Ionicons name="ribbon-sharp" size={24} color="#FFD700" />
            <Text style={globalStyles.rankText}>Oro</Text>
          </View>
        </View>

        {/* SECCIÓN DERECHA: Habilidades */}
        <View style={styles.rightColumn}>
        
          {/* Sub-sección Arriba: Ofrece */}
          <View style={globalStyles.skillsSection}>
            <Text style={styles.skillLabel}>OFRECE:</Text>
            <View style={styles.tagWrapper}>
              <Text style={styles.skillTag}>React</Text>
              <Text style={styles.skillTag}>UX/UI</Text>
            </View>
          </View>

          {/* Línea divisoria interna horizontal */}
          <View style={globalStyles.innerDivider} />

          {/* Sub-sección Abajo: Busca */}
          <View style={globalStyles.skillsSection}>
            <Text style={styles.skillLabel}>BUSCA:</Text>
            <View style={styles.tagWrapper}>
              <Text style={styles.skillTag}>Node.js</Text>
              <Text style={styles.skillTag}>Python</Text>
            </View>
          </View>
        
        </View>
      </View>

      {/* Sección Opciones */}
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

// Estilos Propios
const styles = StyleSheet.create({
// Estilo Container Tarjeta Perfil
  // COLUMNA IZQUIERDA
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
  // COLUMNA DERECHA
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
//Estilo Contenido Opciones
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