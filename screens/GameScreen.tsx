import React, { useRef, useEffect, useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const GameStartScreen = ({ navigation }: any) => {
  const birdY = useRef(new Animated.Value(0)).current;
  const cloudsX = useRef(new Animated.Value(0)).current;
  const cloudsOpacity = useRef(new Animated.Value(0.2)).current; // Para animar opacidad de nubes
  const fadeIn = useRef(new Animated.Value(0)).current;
  const birdLiftOff = useRef(new Animated.Value(0)).current;
  const startButtonPulse = useRef(new Animated.Value(1)).current; // Animación pulso para botón

  const pipesX = useRef(new Animated.Value(width)).current;

  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Animación de pájaro flotando arriba y abajo
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

   
    Animated.loop(
      Animated.timing(cloudsX, {
        toValue: -width,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cloudsOpacity, {
          toValue: 0.6,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(cloudsOpacity, {
          toValue: 0.2,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(startButtonPulse, {
          toValue: 1.1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(startButtonPulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handleStartPress = () => {
    setShowIntro(true);

    startButtonPulse.stopAnimation();

    Animated.timing(birdLiftOff, {
      toValue: -300,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(pipesX, {
      toValue: -100,
      duration: 3500,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      navigation.navigate('Game');
    }, 4000);
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://i.pinimg.com/originals/53/12/f2/5312f22d981305e023cee992b367813c.jpg',
      }}
      style={styles.background}
    >
      <StatusBar hidden />

      <Animated.Image
        source={{
          uri: 'https://png.pngtree.com/thumb_back/fw800/background/20230717/pngtree-white-clouds-on-a-blue-sky-background-image_3924973.jpg',
        }}
        style={[
          styles.clouds,
          {
            transform: [{ translateX: cloudsX }],
            opacity: cloudsOpacity,
          },
        ]}
      />

      <View style={styles.overlay}>
        <Animated.View style={{ opacity: fadeIn, alignItems: 'center' }}>
          {!showIntro ? (
            <>
              <Text style={styles.title}>🎯 Flappy Dart</Text>

              <Animated.Image
                source={{
                  uri: 'https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=204,height=204,fit=cover,f=auto/5e0df231478aa0a331a4718d09dd91a2.png',
                }}
                style={[styles.bird, { transform: [{ translateY: birdY }] }]}
              />

              <Animated.View style={{ transform: [{ scale: startButtonPulse }] }}>
                <TouchableOpacity
                  style={styles.startButton}
                  activeOpacity={0.8}
                  onPress={handleStartPress}
                >
                  <Text style={styles.startText}>🚀 ¡Comenzar Juego!</Text>
                </TouchableOpacity>
              </Animated.View>

              <Text style={styles.subtitle}>
                Toca para volar y esquivar los obstáculos
              </Text>
            </>
          ) : (
            <>
              <Animated.Image
                source={{
                  uri: 'https://www.pngplay.com/wp-content/uploads/6/Game-Over-Yellow-Transparent-PNG.png',
                }}
                style={[
                  styles.bird,
                  {
                    transform: [{ translateY: birdLiftOff }],
                  },
                ]}
              />

              <Animated.View
                style={[styles.pipesContainer, { transform: [{ translateX: pipesX }] }]}
              >
               
                <Animated.Image
                  source={{
                    uri: 'https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=204,height=204,fit=cover,f=auto/5e0df231478aa0a331a4718d09dd91a2.png',
                  }}
                  style={styles.pipeBird}
                />

                <View style={styles.pipeColumn}>
                  <Animated.Image
                    source={{
                      uri: 'https://flappy-bird-ebon-chi.vercel.app/assets/pipe.png',
                    }}
                    style={[styles.pipe, { height: 0, marginBottom: 80 }]}
                  />
                  <Animated.Image
                    source={{
                      uri: 'https://flappy-bird-ebon-chi.vercel.app/assets/pipe.png',
                    }}
                    style={[
                      styles.pipe,
                      { height: 280, transform: [{ rotate: '180deg' }] },
                    ]}
                  />
                </View>

              
                <View style={styles.pipeColumn}>
                  <Animated.Image
                    source={{
                      uri: 'https://flappy-bird-ebon-chi.vercel.app/assets/pipe.png',
                    }}
                    style={[styles.pipe, { height: 160, marginBottom: 80 }]}
                  />
                  <Animated.Image
                    source={{
                      uri: 'https://flappy-bird-ebon-chi.vercel.app/assets/pipe.png',
                    }}
                    style={[
                      styles.pipe,
                      { height: 300, transform: [{ rotate: '180deg' }] },
                    ]}
                  />
                </View>

                <View style={styles.pipeColumn}>
                  <Animated.Image
                    source={{
                      uri: 'https://flappy-bird-ebon-chi.vercel.app/assets/pipe.png',
                    }}
                    style={[styles.pipe, { height: 170, marginBottom: 80 }]}
                  />
                  <Animated.Image
                    source={{
                      uri: 'https://flappy-bird-ebon-chi.vercel.app/assets/pipe.png',
                    }}
                    style={[
                      styles.pipe,
                      { height: 290, transform: [{ rotate: '180deg' }] },
                    ]}
                  />
                </View>
              </Animated.View>
            </>
          )}
        </Animated.View>
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
    opacity: 0.1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  pipeBird: {
    position: 'absolute',
    width: 90,
    height: 90,
    top: '50%',
    left: '50%',
    marginLeft: -35,
    marginTop: -35,
    zIndex: 10,
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
    color: '#eee',
    fontWeight: '600',
  },
  pipesContainer: {
    flexDirection: 'row',
    gap: 70,
  },
  pipeColumn: {
    flexDirection: 'column',
  },
  pipe: {
    width: 150,
    resizeMode: 'contain',
  },
});