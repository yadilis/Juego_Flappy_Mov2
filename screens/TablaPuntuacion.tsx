import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  Animated, Easing, ImageBackground, TouchableOpacity,
  Dimensions, StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const puntuacionesMock = [
  { id: '1', nombre: 'FlappyMaster', puntuacion: 247, bird: '🐦', color: '#FFD700' },
  { id: '2', nombre: 'SkyWalker', puntuacion: 189, bird: '🦅', color: '#C0C0C0' },
  { id: '3', nombre: 'BirdLord', puntuacion: 156, bird: '🐤', color: '#CD7F32' },
  { id: '4', nombre: 'WingMaster', puntuacion: 134, bird: '🐥', color: '#4CAF50' },
  { id: '5', nombre: 'FeatherKing', puntuacion: 98, bird: '🦜', color: '#2196F3' },
  { id: '6', nombre: 'FlightAce', puntuacion: 67, bird: '🕊️', color: '#9C27B0' },
];

export default function TablaPuntuacion({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnims = useRef(puntuacionesMock.map(() => new Animated.Value(0))).current;
  const flyAnims = useRef(puntuacionesMock.map(() => new Animated.Value(0))).current;
  const pipeAnims = useRef([new Animated.Value(0), new Animated.Value(0)]).current;
  const cloudAnims = useRef(Array(5).fill(0).map(() => new Animated.Value(0))).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Animación principal de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();

    // Animación de pájaros volando
    scaleAnims.forEach((anim, i) => {
      Animated.sequence([
        Animated.delay(i * 300),
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    });

    // Animación de vuelo de pájaros (arriba y abajo)
    flyAnims.forEach((anim, i) => {
      const flyLoop = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000 + i * 200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 2000 + i * 200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            })
          ])
        ).start();
      };
      setTimeout(flyLoop, i * 500);
    });

    // Animación de tuberías moviéndose
    const pipeLoop = () => {
      pipeAnims.forEach((anim, i) => {
        Animated.loop(
          Animated.timing(anim, {
            toValue: 1,
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start(() => {
          anim.setValue(0);
        });
      });
    };
    pipeLoop();

    // Animación de nubes flotando
    cloudAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 15000 + i * 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start(() => {
        anim.setValue(0);
      });
    });

    // Animación de rebote para el título
    const bounceLoop = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      ]).start(bounceLoop);
    };
    bounceLoop();

    // Celebración inicial
    setTimeout(() => {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }, 1000);
  }, []);

  const handleItemPress = (itemId: string, index: number) => {
    setSelectedItem(itemId);
    
    // Animación de "flap" al tocar
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        tension: 200,
        friction: 6,
        useNativeDriver: true,
      })
    ]).start();

    // Celebración especial para el primer lugar
    if (index === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    
    setTimeout(() => setSelectedItem(null), 600);
  };

  const getRankData = (index: number) => {
    switch (index) {
      case 0: 
        return {
          medal: '🥇',
          title: 'FLAPPY BIRD',
          pipe: '🟢',
          effect: '✨'
        };
      case 1: 
        return {
          medal: '🥈',
          title: 'SKY MASTER',
          pipe: '🔵',
          effect: '⭐'
        };
      case 2: 
        return {
          medal: '🥉',
          title: 'WING HERO',
          pipe: '🟡',
          effect: '💫'
        };
      default: 
        return {
          medal: `${index + 1}°`,
          title: 'FLYER',
          pipe: '⚪',
          effect: '🌟'
        };
    }
  };

  const renderClouds = () => (
    <View style={styles.cloudsContainer}>
      {cloudAnims.map((anim, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.cloud,
            {
              opacity: 0.7,
              transform: [{
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, width + 50]
                })
              }],
              top: `${10 + i * 15}%`,
            }
          ]}
        >
          ☁️
        </Animated.Text>
      ))}
    </View>
  );

  const renderPipes = () => (
    <View style={styles.pipesContainer}>
      {pipeAnims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.pipe,
            {
              transform: [{
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, -100]
                })
              }],
              top: i === 0 ? '20%' : '70%',
            }
          ]}
        >
          <Text style={styles.pipeText}>🟢</Text>
        </Animated.View>
      ))}
    </View>
  );

  const renderCelebration = () => {
    if (!showCelebration) return null;
    
    return (
      <View style={styles.celebrationContainer}>
        {['🎉', '🎊', '🌟', '✨', '🎈', '🎁', '🏆', '⭐'].map((emoji, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.celebrationItem,
              {
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 60 + 20}%`,
                transform: [
                  { scale: bounceAnim },
                  { rotate: bounceAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: ['0deg', '15deg']
                  })}
                ]
              }
            ]}
          >
            {emoji}
          </Animated.Text>
        ))}
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const rankData = getRankData(index);
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleItemPress(item.id, index)}
      >
        <Animated.View
          style={[
            styles.row,
            {
              transform: [
                { scale: scaleAnims[index] },
                { 
                  translateY: flyAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8]
                  })
                }
              ],
              backgroundColor: item.color + '15',
              borderColor: item.color + '80',
            },
            selectedItem === item.id && styles.selectedRow,
            index < 3 && styles.podiumRow
          ]}
        >
          {/* Pájaro animado */}
          <View style={styles.birdSection}>
            <Animated.View style={[
              styles.birdContainer,
              {
                backgroundColor: item.color + '30',
                borderColor: item.color,
                transform: [{ 
                  rotate: flyAnims[index].interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0deg', '-5deg', '0deg']
                  })
                }]
              }
            ]}>
              <Text style={styles.birdEmoji}>{item.bird}</Text>
              <Animated.Text style={[
                styles.wingFlap,
                {
                  opacity: flyAnims[index].interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 1, 0.3]
                  })
                }
              ]}>
                💨
              </Animated.Text>
            </Animated.View>
          </View>

          {/* Ranking con temática Flappy */}
          <View style={styles.rankSection}>
            <View style={[styles.medalContainer, { backgroundColor: item.color + '20' }]}>
              <Text style={styles.medalText}>{rankData.medal}</Text>
            </View>
            <Text style={styles.rankTitle}>{rankData.title}</Text>
          </View>

          {/* Información del jugador */}
          <View style={styles.playerSection}>
            <Text style={[styles.playerName, { color: item.color }]}>
              {item.nombre}
            </Text>
            <View style={styles.scoreRow}>
              <Text style={styles.pipeIcon}>🟢</Text>
              <Text style={[styles.scoreText, { color: item.color }]}>
                {item.puntuacion}
              </Text>
              <Text style={styles.scoreLabel}>PIPES</Text>
            </View>
          </View>

          {/* Efectos especiales para top 3 */}
          {index < 3 && (
            <>
              <View style={styles.effectContainer}>
                <Animated.Text style={[
                  styles.specialEffect,
                  {
                    transform: [{ 
                      scale: bounceAnim.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [1, 1.2]
                      })
                    }]
                  }
                ]}>
                  {rankData.effect}
                </Animated.Text>
              </View>
              <View style={styles.crownEffect}>
                <Text style={styles.crown}>👑</Text>
              </View>
            </>
          )}

          {/* Indicador de vuelo */}
          <Animated.View style={[
            styles.flightIndicator,
            {
              opacity: flyAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1]
              })
            }
          ]}>
            <Text style={styles.flightIcon}>🌪️</Text>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={{ uri: 'https://e0.pxfuel.com/wallpapers/488/135/desktop-wallpaper-flappy-bird-background.jpg' }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Elementos de fondo animados */}
        <View style={styles.gameOverlay} />
        {renderClouds()}
        {renderPipes()}
        {renderCelebration()}
        
        <Animated.View 
          style={[
            styles.container, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header temático de Flappy Bird */}
          <View style={styles.flappyHeader}>
            <Animated.View style={[
              styles.titleContainer,
              { transform: [{ scale: bounceAnim }] }
            ]}>
              <Text style={styles.flappyTitle}>FLAPPY</Text>
              <View style={styles.birdTitleContainer}>
                <Text style={styles.titleBird}>🐦</Text>
                <Animated.Text style={[
                  styles.titleWing,
                  {
                    transform: [{ 
                      rotate: bounceAnim.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: ['0deg', '20deg']
                      })
                    }]
                  }
                ]}>
                  💨
                </Animated.Text>
              </View>
              <Text style={styles.leaderboardTitle}>TABLA DE LÍDERES</Text>
            </Animated.View>
            <Text style={styles.subtitle}>🏆 MEJORES PILOTOS🏆</Text>
          </View>

          {/* Leaderboard con temática de juego */}
          <View style={styles.gameContainer}>
            <View style={styles.scoreHeader}>
              <Text style={styles.headerIcon}>🏅</Text>
              <Text style={styles.headerText}>RANKING</Text>
              <Text style={styles.headerIcon}>🟢</Text>
              <Text style={styles.headerText}>PIPES PASSED</Text>
              <Text style={styles.headerIcon}>🏅</Text>
            </View>

            <FlatList
              data={puntuacionesMock}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>

          {/* Botón de regreso temático */}
          <TouchableOpacity 
            style={styles.flappyButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <View style={styles.buttonBird}>
              <Text style={styles.buttonBirdEmoji}>🐦</Text>
              <Text style={styles.buttonWing}>💨</Text>
            </View>
            <Text style={styles.buttonText}>FLY BACK</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  gameOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
  },
  cloudsContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  cloud: {
    position: 'absolute',
    fontSize: 30,
  },
  pipesContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  pipe: {
    position: 'absolute',
    width: 60,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipeText: {
    fontSize: 40,
    transform: [{ scaleY: 3 }],
  },
  celebrationContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  celebrationItem: {
    position: 'absolute',
    fontSize: 25,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  flappyHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  flappyTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: '#FFD23F',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
  },
  birdTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  titleBird: {
    fontSize: 40,
    marginHorizontal: 10,
  },
  titleWing: {
    fontSize: 25,
    marginLeft: -15,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#20272F',
    letterSpacing: 2,
    textShadowColor: '#45B7AA',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FF6B35',
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: '700',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 4,
    borderColor: '#FFD23F',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  listContent: {
    paddingVertical: 10,
  },
  separator: {
    height: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  podiumRow: {
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  selectedRow: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0fff0',
  },
  birdSection: {
    marginRight: 12,
  },
  birdContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  birdEmoji: {
    fontSize: 24,
  },
  wingFlap: {
    position: 'absolute',
    right: -8,
    top: 5,
    fontSize: 12,
  },
  rankSection: {
    alignItems: 'center',
    marginRight: 15,
  },
  medalContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD23F',
  },
  medalText: {
    fontSize: 20,
    fontWeight: '900',
  },
  rankTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#666',
    marginTop: 3,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  playerSection: {
    flex: 1,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pipeIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: '900',
    marginRight: 5,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  effectContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  specialEffect: {
    fontSize: 20,
  },
  crownEffect: {
    position: 'absolute',
    top: -5,
    right: 25,
  },
  crown: {
    fontSize: 16,
  },
  flightIndicator: {
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  flightIcon: {
    fontSize: 14,
  },
  flappyButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFD23F',
  },
  buttonBird: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonBirdEmoji: {
    fontSize: 24,
    marginRight: 5,
  },
  buttonWing: {
    fontSize: 16,
    marginLeft: -8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});