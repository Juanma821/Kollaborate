import * as React from "react";
import { router } from 'expo-router';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View } from "react-native";

import { Colors } from '../../assets/images/constants/Colors';
import { globalStyles } from '../../assets/images/constants/globalStyles';

import { useSharedValue } from "react-native-reanimated"; //Install
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel"; //Install

const data = [...new Array(3).keys()];
const width = Dimensions.get("window").width;

export default function Home() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={globalStyles.containerApp}>
      {/* SECCIÓN SUPERIOR: Carrusel */}
      <View style={styles.carouselContainer}>
        <Carousel
          ref={ref}
          width={width}
          height={width / 2}
          data={data}
          onProgressChange={progress}
          autoPlay={true}
          autoPlayInterval={3000}
          renderItem={({ index }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>Novedad {index + 1}</Text>
              <Text style={styles.subText}>Publicidad o Anuncio de Kollaborate</Text>
            </View>
          )}
        />

        {/* Paginación/Puntitos */}
        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          containerStyle={styles.paginationContainer}
          onPress={onPressPagination}
        />
      </View>

      {/* TÍTULO */}     
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explorar Habilidades</Text>
      </View>

      {/* SECCIÓN INFERIOR: Contenido Opciones */}
      <View style={[globalStyles.contentSectionA, {backgroundColor: Colors.card}]}>
        <View style={styles.columnHomeR}>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/configuration')}>
             <Text>Acceso 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/configuration')}>
             <Text>Acceso 2</Text>
          </TouchableOpacity>  
        </View>

        <View style={styles.columnHomeL}>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/configuration')}>
             <Text>Acceso 3</Text>
          </TouchableOpacity>  
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/configuration')}>
             <Text>Acceso 4</Text>
          </TouchableOpacity>  
        </View>
      </View>
    </View>
  );
}

//Estilos Propios
const styles = StyleSheet.create({
//Carrusel
  carouselContainer: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingBottom: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: Colors.colorCard,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardText: {
    color: Colors.textLight,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: Colors.textLight,
    fontSize: 12,
    opacity: 0.8,
  },
//Paginación-Puntitos
  paginationContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },
  dot: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 50,
    width: 8,
    height: 8,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 20,
  },
//Título
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
    color: Colors.textDark,
  },
//Contenido Opciones
  columnHomeR: {
    flex: 0.50,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
    paddingRight: 10,
  },
  columnHomeL: {
    flex: 0.50,
    alignItems: 'center',
    paddingLeft: 10,
  },
  imageButton: {
    width: '90%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10%',
    backgroundColor: Colors.colorCard, 
    borderRadius: 12,
  },
});