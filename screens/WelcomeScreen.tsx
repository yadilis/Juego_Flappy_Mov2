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
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }:any) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const birdBlink = useRef(new Animated.Value(1)).current;
  const playScale = useRef(new Animated.Value(1)).current;
  const cloudX = useRef(new Animated.Value(-150)).current;
  const cloud2X = useRef(new Animated.Value(-300)).current;
  const birdShadowAnim = useRef(new Animated.Value(0)).current;
  const pixelFallAnim = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0)).current;
  const titleRotate = useRef(new Animated.Value(0)).current;
  const backgroundPulse = useRef(new Animated.Value(1)).current;
  const buttonGlow = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;
  const birdRotate = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  
  const [glitch, setGlitch] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {

    setTimeout(() => {
      setShowTitle(true);
      Animated.spring(titleScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 500);

   
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 5,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();

   
    Animated.loop(
      Animated.sequence([
        Animated.timing(birdRotate, {
          toValue: -10,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(birdRotate, {
          toValue: 10,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(birdRotate, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(birdBlink, {
          toValue: 0.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(birdBlink, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
      ])
    ).start();


    Animated.loop(
      Animated.sequence([
        Animated.timing(playScale, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(playScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

  
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();


    Animated.loop(
      Animated.timing(cloudX, {
        toValue: width + 200,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(cloud2X, {
        toValue: width + 300,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

 
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundPulse, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundPulse, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    
    Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim, {
          toValue: height,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(starAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pixelFallAnim, {
          toValue: height + 50,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(pixelFallAnim, {
          toValue: -50,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(titleRotate, {
          toValue: 2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(titleRotate, {
          toValue: -2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(titleRotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();
  }, []);

  function onPlayPress() {
    setGlitch(true);
    
  
    Animated.parallel([
      Animated.timing(titleScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(playScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setGlitch(false);
      navigation.navigate("Login");
    }, 400);
  }

  const renderPixels = () => {
    const pixels = [];
    for (let i = 0; i < 15; i++) {
      const delay = i * 200;
      pixels.push(
        <Animated.View
          key={i}
          style={[
            styles.pixel,
            {
              left: Math.random() * width,
              transform: [
                { 
                  translateY: pixelFallAnim.interpolate({
                    inputRange: [0, height],
                    outputRange: [0, height + 100],
                  })
                },
                {
                  rotate: pixelFallAnim.interpolate({
                    inputRange: [0, height],
                    outputRange: ['0deg', '360deg'],
                  })
                }
              ],
              opacity: pixelFallAnim.interpolate({
                inputRange: [0, height / 3, height * 2/3, height],
                outputRange: [0, 1, 0.8, 0],
              }),
            },
          ]}
        />
      );
    }
    return pixels;
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 20; i++) {
      stars.push(
        <Animated.View
          key={i}
          style={[
            styles.star,
            {
              left: Math.random() * width,
              top: Math.random() * height * 0.6,
              opacity: starAnim,
              transform: [{
                scale: starAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.5],
                })
              }]
            },
          ]}
        />
      );
    }
    return stars;
  };

  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 8; i++) {
      particles.push(
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: i * (width * 0.12) + width * 0.1,
              transform: [
                { translateY: particleAnim },
                {
                  translateX: particleAnim.interpolate({
                    inputRange: [0, height],
                    outputRange: [0, (Math.random() - 0.5) * 100],
                  })
                }
              ],
              opacity: particleAnim.interpolate({
                inputRange: [0, height / 4, height * 3/4, height],
                outputRange: [1, 0.8, 0.4, 0],
              }),
            },
          ]}
        />
      );
    }
    return particles;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      
      <Animated.View style={[styles.backgroundContainer, { transform: [{ scale: backgroundPulse }] }]}>
        <ImageBackground
          source={{ uri: 'https://www.cdnlogo.com/logos/f/36/flappy-bird.svg' }}
          style={styles.background}
          resizeMode="repeat"
        >
    
          <View style={styles.gradientOverlay} />
          
       
          {renderStars()}
          
       
          <Animated.Image
            source={{ uri: 'https://media.indiedb.com/images/games/1/61/60262/Flappy_Bird_XMas_icon.1.png' }}
            style={[styles.cloud, { transform: [{ translateX: cloudX }] }]}
            resizeMode="contain"
          />
          
          <Animated.Image
            source={{ uri: 'https://media.indiedb.com/images/games/1/61/60262/Flappy_Bird_XMas_icon.1.png' }}
            style={[styles.cloud2, { transform: [{ translateX: cloud2X }] }]}
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
          {renderParticles()}

          <View style={styles.container}>
            {showTitle && (
              <Animated.View
                style={[
                  styles.titleContainer,
                  {
                    transform: [
                      { scale: titleScale },
                      { rotateZ: titleRotate.interpolate({
                          inputRange: [-2, 2],
                          outputRange: ['-2deg', '2deg']
                        })
                      }
                    ]
                  }
                ]}
              >
                <Text style={[styles.title, glitch && styles.glitchTitle]}>
                  FLAPPY BIRD
                </Text>
                <Text style={styles.subtitle}>¡La Aventura Comienza!</Text>
              </Animated.View>
            )}

            <Animated.Image
              source={{ uri: 'https://i.pinimg.com/736x/a0/10/96/a01096406d987a54c14d498a6b420960.jpg' }}
              style={[
                styles.bird,
                {
                  transform: [
                    { translateY: bounceAnim },
                    { rotateZ: birdRotate.interpolate({
                        inputRange: [-10, 10],
                        outputRange: ['-10deg', '10deg']
                      })
                    }
                  ],
                  opacity: birdBlink,
                },
              ]}
              resizeMode="contain"
            />

            <Animated.View 
              style={{ 
                transform: [{ scale: playScale }],
              }}
            >
              <TouchableOpacity 
                style={[
                  styles.button, 
                  glitch && styles.glitch,
                ]} 
                onPress={onPlayPress}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.buttonGlow,
                    {
                      opacity: buttonGlow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.6]
                      })
                    }
                  ]}
                />
                <Text style={[styles.buttonText, glitch && styles.glitchText]}>
                  BIENVENID@ 
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.howToPlayButton} activeOpacity={0.7}>
              <Text style={styles.howToPlayText}>✨ ¿Cómo jugar? ✨</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#4a90e2',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  cloud: {
    position: 'absolute',
    top: height * 0.08,
    width: width * 0.25,
    height: height * 0.06,
    opacity: 0.7,
  },
  cloud2: {
    position: 'absolute',
    top: height * 0.18,
    width: width * 0.2,
    height: height * 0.05,
    opacity: 0.5,
  },
  pipeLeft: {
    position: 'absolute',
    left: 10,
    bottom: height * 0.15,
    width: width * 0.12,
    height: height * 0.25,
    transform: [{ rotate: '180deg' }],
    opacity: 0.6,
  },
  pipeRight: {
    position: 'absolute',
    right: 10,
    bottom: height * 0.17,
    width: width * 0.12,
    height: height * 0.27,
    opacity: 0.6,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: '900',
    color: '#ffeb3b',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 15,
    textAlign: 'center',
    borderWidth: 3,
    borderColor: '#ff9800',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.015,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 25,
    maxWidth: width * 0.9,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginTop: 8,
    textAlign: 'center',
  },
  glitchTitle: {
    borderColor: '#ff0000',
    color: '#ff4444',
    textShadowColor: '#ff0000',
  },
  bird: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: height * 0.05,
    borderRadius: width * 0.175,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  button: {
    backgroundColor: '#32cd32',
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.25,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#1a801a',
    shadowColor: '#248f24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    marginBottom: 25,
    minWidth: width * 0.5,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderRadius: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.041,
    fontWeight: '300',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  glitch: {
    borderColor: '#ff0000',
    backgroundColor: '#ff4444',
    shadowColor: '#ff0000',
  },
  glitchText: {
    color: '#fff',
    textShadowColor: '#ff0000',
  },
  howToPlayButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  howToPlayText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  pixel: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#ffeb3b',
    borderRadius: 3,
    shadowColor: '#ffeb3b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#ff9800',
    borderRadius: 4,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});