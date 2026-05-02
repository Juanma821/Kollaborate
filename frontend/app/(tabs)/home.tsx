import * as React from "react";
import { router } from 'expo-router';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View, Image, ImageBackground, ScrollView } from "react-native";

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
      <ScrollView
        showsVerticalScrollIndicator={false} // Oculta la barra de scroll para un look más limpio
        contentContainerStyle={{ paddingBottom: 20 }} // Espacio extra al final
      >
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

        <View style={[globalStyles.divider, { marginVertical: 5, marginBottom: 5 }]} />

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Podría interesarte</Text>
        </View>

        {/* Accesos rápidos */}
        <View style={styles.accessSection}>
          <View style={styles.column}>
            <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/profile/skills')}>
              <ImageBackground
                source={require('../../assets/images/Skills.png')}
                style={styles.bgImage}
                imageStyle={{ borderRadius: 12 }}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={styles.buttonText}>Habilidades</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/profile/statistics')}>
              <ImageBackground
                source={require('../../assets/images/Statistic.png')}
                style={styles.bgImage}
                imageStyle={{ borderRadius: 12 }}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={[styles.buttonText,{fontSize: 16,}]}>Estadísticas</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.column}>
            <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/profile/token')}>
              <ImageBackground
                source={require('../../assets/images/Tokens.png')}
                style={styles.bgImage}
                imageStyle={{ borderRadius: 12 }}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={styles.buttonText}>Tokens</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imageButton} onPress={() => router.push('/profile/configuration/report')}>
              <ImageBackground
                source={require('../../assets/images/Report.png')}
                style={styles.bgImage}
                imageStyle={{ borderRadius: 12 }}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={styles.buttonText}>Reportes</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center',
    backgroundColor: Colors.appBg,

    paddingBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: Colors.colorCard,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardText: {
    color: '#FFFFFF',
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
    margin: 10,
    color: Colors.TextprimaryDark,
  },
  accessSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  column: {
    width: '48%',
  },
  imageButton: {
    height: 225,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 5,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'monospace',
  }
});