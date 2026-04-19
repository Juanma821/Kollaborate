import * as React from "react";
import { router } from 'expo-router';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View } from "react-native";

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
    <View style={styles.container}>
      {/* Contenedor del Carrusel */}
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

      {/* Título */}     
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explorar Habilidades</Text>
      </View>

      {/* Acceso Rápido */}
      <View style={styles.contentSection}>
        <View style={styles.leftColumn}>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/configuration')}>
             <Text>Acceso 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/configuration')}>
             <Text>Acceso 2</Text>
          </TouchableOpacity>  
        </View>

        <View style={styles.rightColumn}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  //Carrusel
  carouselContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#ff743dff',
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: '#fff',
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
    backgroundColor: "#ff743dff",
    width: 20,
  },
  //Estilo Título
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
    color: '#333',
  },
  //Estilo Contenido Opciones
  contentSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#fff',
  },
  leftColumn: {
    flex: 0.50,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingRight: 10,
  },
  rightColumn: {
    flex: 0.50,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
    paddingLeft: 10,
  },
  imageButton: {
    width: '90%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10%',
    backgroundColor: '#ff743dff', 
    borderRadius: 12,
  },
});