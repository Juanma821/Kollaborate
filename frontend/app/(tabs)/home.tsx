import * as React from "react";
import { router } from 'expo-router';
// 1. IMPORTANTE: Agregamos Image a los componentes de react-native
import { TouchableOpacity, Dimensions, StyleSheet, Text, View, Image } from "react-native";

import { Colors } from '../../assets/images/constants/Colors';
import { globalStyles } from '../../assets/images/constants/globalStyles';

import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";

const data = [
  { id: 1, title: '', img: require('../../assets/images/Carrusel-01.png') },
  { id: 2, title: 'Nuevas Habilidades', img: require('../../assets/images/Carrusel-01.png') },
  { id: 3, title: 'Gana Tokens', img: require('../../assets/images/Carrusel-01.png') },
];

const width = Dimensions.get("window").width;
const ASPECT_RATIO = 3508 / 2480;
const CAROUSEL_HEIGHT = width / ASPECT_RATIO;

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
      {/* Carrusel */}
      <View style={styles.carouselContainer}>
        <Carousel
          ref={ref}
          width={width}
          height={CAROUSEL_HEIGHT}
          data={data}
          onProgressChange={progress}
          autoPlay={true}
          autoPlayInterval={3000}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.img} style={styles.cardImage} />
            </View>
          )}
        />
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
        <Text style={styles.title}>Podría interesarte</Text>
      </View>

      {/* Accesos rapidos */}
      <View style={[globalStyles.contentSectionA, { backgroundColor: Colors.card }]}>
        <View style={styles.columnHomeR}>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/skills')}>
            <Text>Ser Mentor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/statistics')}>
            <Text>Estadísticas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.columnHomeL}>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/token')}>
            <Text>Mi Billetera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/(tabs)/profile/configuration/report')}>
            <Text>Reportes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    // Eliminamos el paddingBottom fijo y dejamos que el contenido mande
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 10, // Un pequeño margen para que no toque los bordes físicos del cel
    backgroundColor: Colors.colorCard,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ahora que las proporciones coinciden, 'cover' no recortará casi nada
  },
  textOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Oscurece un poco la imagen para que el texto sea legible
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardText: {
    color: '#FFFFFF', // Blanco para que resalte sobre el overlay
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
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
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
    color: Colors.TextprimaryDark,
  },
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
    width: '65%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5%',
    backgroundColor: Colors.colorCard,
    borderRadius: 12,
  },
});