import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const GameStartScreen = ({ navigation }: any) => {
  const birdY = useRef(new Animated.Value(0)).current;
  const cloudsX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Movimiento de pájaro (más suave y ágil)
    Animated.loop(
      Animated.sequence([
        Animated.timing(birdY, {
          toValue: -20,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(birdY, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Movimiento continuo de nubes
    Animated.loop(
      Animated.timing(cloudsX, {
        toValue: -width,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/originals/53/12/f2/5312f22d981305e023cee992b367813c.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar hidden />

      {/* Nubes animadas */}
      <Animated.Image
        source={{ uri: 'https://png.pngtree.com/thumb_back/fw800/background/20230717/pngtree-white-clouds-on-a-blue-sky-background-image_3924973.jpg' }}
        style={[
          styles.clouds,
          { transform: [{ translateX: cloudsX }] },
        ]}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>🎯 Flappy Dart</Text>

        <Animated.Image
          source={{ uri: 'https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=204,height=204,fit=cover,f=auto/5e0df231478aa0a331a4718d09dd91a2.png' }}
          style={[styles.bird, { transform: [{ translateY: birdY }] }]}
        />

        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Game')}
        >
          <Text style={styles.startText}>🚀 ¡Comenzar Juego!</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Toca para volar y esquivar los obstáculos</Text>
      </View>
    </ImageBackground>
  );
};

export default GameStartScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  clouds: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    opacity: 0.25,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,50,0.3)',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  bird: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 35,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    marginBottom: 20,
  },
  startText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
