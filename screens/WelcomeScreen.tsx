import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }:any) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const birdBlink = useRef(new Animated.Value(1)).current;
  const playScale = useRef(new Animated.Value(1)).current;
  const cloudX = useRef(new Animated.Value(-150)).current;
  const birdShadowAnim = useRef(new Animated.Value(0)).current;
  const pixelFallAnim = useRef(new Animated.Value(0)).current;
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -12,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(birdBlink, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(birdBlink, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(playScale, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(playScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(cloudX, {
        toValue: width + 150,
        duration: 12000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(birdShadowAnim, {
          toValue: 6,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(birdShadowAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pixelFallAnim, {
          toValue: height,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pixelFallAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  function onPlayPress() {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 400);
  }

  const renderPixels = () => {
    const pixels = [];
    for (let i = 0; i < 10; i++) {
      pixels.push(
        <Animated.View
          key={i}
          style={[
            styles.pixel,
            {
              left: i * (width * 0.08) + width * 0.05,
              transform: [{ translateY: pixelFallAnim }],
              opacity: pixelFallAnim.interpolate({
                inputRange: [0, height / 2, height],
                outputRange: [1, 0.4, 0],
              }),
            },
          ]}
        />
      );
    }
    return pixels;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ImageBackground
        source={{ uri: 'https://www.cdnlogo.com/logos/f/36/flappy-bird.svg' }}
        style={styles.background}
        resizeMode="repeat"
      >
        <Animated.Image
          source={{ uri: 'https://media.indiedb.com/images/games/1/61/60262/Flappy_Bird_XMas_icon.1.png' }}
          style={[styles.cloud, { transform: [{ translateX: cloudX }] }]}
          resizeMode="contain"
        />

        <Image
          source={{ uri: 'https://art.pixilart.com/sr29cd06c39f7aws3.png' }}
          style={styles.pipeLeft}
          resizeMode="contain"
        />

        <Image
          source={{ uri: 'https://e7.pngegg.com/pngimages/376/525/png-clipart-blue-flappy-bird-sprite-bird-animals-desktop-wallpaper.png' }}
          style={styles.pipeRight}
          resizeMode="contain"
        />

        {renderPixels()}

        <View style={styles.container}>
          <Text style={styles.title}>FLAPPY BIRD</Text>

          <Animated.Image
            source={{ uri: 'https://i.pinimg.com/736x/a0/10/96/a01096406d987a54c14d498a6b420960.jpg' }}
            style={[
              styles.bird,
              {
                transform: [{ translateY: bounceAnim }],
                opacity: birdBlink,
              },
            ]}
            resizeMode="contain"
          />

          <Animated.View style={{ transform: [{ scale: playScale }] }}>
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Bienvenid@</Text>
      </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.howToPlayButton} activeOpacity={0.7}>
            <Text style={styles.howToPlayText}>¿Cómo jugar?</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#70c5ce',
  },
  cloud: {
    position: 'absolute',
    top: height * 0.08,
    width: width * 0.3,
    height: height * 0.08,
    opacity: 0.8,
  },
  pipeLeft: {
    position: 'absolute',
    left: 10,
    bottom: height * 0.15,
    width: width * 0.12,
    height: height * 0.25,
    transform: [{ rotate: '180deg' }],
    opacity: 0.8,
  },
  pipeRight: {
    position: 'absolute',
    right: 10,
    bottom: height * 0.17,
    width: width * 0.12,
    height: height * 0.27,
    opacity: 0.8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontWeight: '900',
    color: '#ffeb3b',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    textAlign: 'center',
    marginBottom: height * 0.05,
    borderWidth: 2,
    borderColor: '#ff9800',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.012,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    maxWidth: width * 0.9,
  },
  bird: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: height * 0.05,
  },
  playButton: {
   
    alignItems: 'center',
  },
  glitch: {
    borderColor: '#ff0000',
    shadowColor: '#ff0000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    transform: [{ translateX: 2 }],
  },
  playText: {
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#004d00',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  howToPlayButton: {
    marginTop: 10,
  },
  howToPlayText: {
    color: '#fff',
    textDecorationLine: 'underline',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  pixel: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    opacity: 0.8,
    borderRadius: 1,
  },
    button: {
    backgroundColor: '#32cd32',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#1a801a',
    shadowColor: '#248f24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    marginBottom: 20,
    minWidth: width * 0.4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
