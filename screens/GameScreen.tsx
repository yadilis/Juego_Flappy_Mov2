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
  Image,
  Vibration,
} from 'react-native';
import { supabase } from '../Supabase/ConfigSupa';
const { width, height } = Dimensions.get('window');

// Configuración clásica de Flappy Bird - MÁS FÁCIL Y ACCESIBLE
const BIRD_SIZE = 60;
const PIPE_WIDTH = 80;
const PIPE_GAP = 250; // Aumentado de 200 a 250 - Más espacio para pasar
const GRAVITY = 0.35; // Reducido de 0.4 a 0.35 - Aún más suave
const JUMP_STRENGTH = -7.5; // Reducido de -8 a -7.5 - Salto más controlado
const PIPE_SPEED = 2; // Reducido de 2.5 a 2 - Tubos más lentos
const PIPE_INTERVAL = 3000; // Aumentado de 2500 a 3000 - Más tiempo entre tubos

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

const GameStartScreen = ({ navigation }: any) => {
  // Estados del juego - SIMPLIFICADO para Flappy Bird clásico
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [birdY, setBirdY] = useState(height / 2 - 100);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [savedScore, setSavedScore] = useState(false);
  // Referencias para valores actuales - ESTO ES CLAVE PARA SINCRONIZACIÓN
  const currentBirdY = useRef(height / 2 - 100);
  const currentBirdVelocity = useRef(0);
  const currentPipes = useRef<Pipe[]>([]);
  const gameRunning = useRef(false);
  const currentScore = useRef(0); 

  // Animaciones
  const birdAnimation = useRef(new Animated.Value(height / 2 - 100)).current;
  const cloudsX = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const startButtonPulse = useRef(new Animated.Value(1)).current;
  const floatingBird = useRef(new Animated.Value(0)).current;
  const birdRotation = useRef(new Animated.Value(0)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;

  // Referencias para intervalos
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const pipeGeneratorRef = useRef<NodeJS.Timeout | null>(null);

  // FUNCIÓN CORREGIDA PARA TU ESTRUCTURA DE BASE DE DATOS
  const guardarPuntaje = async (puntajeFinal: number): Promise<void> => {
    console.log('🔍 INICIO guardarPuntaje - Puntaje:', puntajeFinal);
    console.log('🔍 SavedScore actual:', savedScore);
    
    if (savedScore) {
      console.log('❌ SALIENDO - Ya guardado');
      return;
    }
    
    setSavedScore(true);
    console.log('✅ setSavedScore(true) ejecutado');
    
    try {
      console.log('🔍 Obteniendo usuario...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Error obteniendo usuario:', userError);
        return;
      }
      
      if (!user) {
        console.error('❌ No hay usuario logueado');
        return;
      }
      
      console.log('✅ Usuario obtenido:', user.id);
      console.log('✅ Email del usuario:', user.email);
      
      console.log('🔍 Buscando perfil de usuario...');
      let perfilData;
      const { data: perfilDataResult, error: perfilError } = await supabase
        .from('perfil_usuarios')
        .select('id, usuario, correo, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (perfilError && perfilError.code === 'PGRST116') {
        console.log('📝 Perfil no encontrado, creando nuevo perfil...');
        const nombreUsuario = user.user_metadata?.full_name || 
                              user.email?.split('@')[0] || 
                              'Usuario';
        
        const { data: nuevoPerfilData, error: crearPerfilError } = await supabase
          .from('perfil_usuarios')
          .insert([{
            id: user.id,
            usuario: nombreUsuario,
            correo: user.email || '',
            edad: null,
            genero: '',
            experiencia: 'Novato',
            avatar_url: null
          }])
          .select()
          .single();
        
        if (crearPerfilError) {
          console.error('❌ Error creando perfil:', crearPerfilError);
          return;
        }
        
        console.log('✅ Perfil creado exitosamente');
        perfilData = nuevoPerfilData;
      } else if (perfilError) {
        console.error('❌ Error obteniendo perfil:', perfilError);
        return;
      } else {
        perfilData = perfilDataResult;
      }
      
      if (!perfilData) {
        console.error('❌ No se encontró perfil para el usuario');
        return;
      }
      
      console.log('✅ Perfil encontrado:', perfilData.id);
      console.log('✅ Nombre del usuario:', perfilData.usuario);
      console.log('✅ Correo del usuario:', perfilData.correo);
      
      // PASO 2: Verificar si ya existe un registro
      const { data: existingData, error: checkError } = await supabase
        .from('puntajes_usuarios')
        .select('*')
        .eq('usuario_perfil_usuario', perfilData.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error verificando registros existentes:', checkError);
        return;
      }
      
      let result: any;
      
      if (existingData) {
        console.log('📊 Registro existente encontrado:', existingData);
        // Actualizar si el nuevo puntaje es mejor
        if (puntajeFinal > existingData.puntaje) {
          console.log('🔄 Actualizando puntaje existente... Anterior:', existingData.puntaje, 'Nuevo:', puntajeFinal);
          result = await supabase
            .from('puntajes_usuarios')
            .update({ 
              puntaje: puntajeFinal,
              usuario: perfilData.usuario,
              avatar_url: perfilData.avatar_url
            })
            .eq('usuario_perfil_usuario', perfilData.id);
        } else {
          console.log('ℹ️ Puntaje actual', puntajeFinal, 'no supera el mejor:', existingData.puntaje);
          console.log('✅ PUNTAJE PROCESADO CORRECTAMENTE (no era record)');
          return;
        }
      } else {
        // Insertar nuevo registro
        console.log('➕ Insertando nuevo registro...');
        const datosAInsertar = {
          usuario_perfil_usuario: perfilData.id,
          puntaje: puntajeFinal,
          usuario: perfilData.usuario,
          avatar_url: perfilData.avatar_url
        };
        
        console.log('🔍 Datos a insertar:', datosAInsertar);
        
        result = await supabase
          .from('puntajes_usuarios')
          .insert([datosAInsertar]);
      }

      if (result?.error) {
        console.error('❌ Error en operación BD:', result.error);
        return;
      }
      
      console.log('✅ PUNTAJE GUARDADO EXITOSAMENTE');
      console.log('✅ Respuesta de la BD:', result?.data);
      
    } catch (error: any) {
      console.error('💥 Error en try-catch:', error);
      
      if (error instanceof Error) {
        console.error('💥 Error name:', error.name);
        console.error('💥 Error message:', error.message);
        console.error('💥 Error stack:', error.stack);
      }
    }
  };

  useEffect(() => {
    // Animación de nubes
    Animated.loop(
      Animated.timing(cloudsX, {
        toValue: -width,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();

    // Fade in inicial
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Animación flotante del pájaro en inicio
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingBird, {
          toValue: -15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatingBird, {
          toValue: 15,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulso del botón
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(startButtonPulse, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(startButtonPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (pipeGeneratorRef.current) clearInterval(pipeGeneratorRef.current);
    };
  }, []);

  // Generar tubo con espacio GARANTIZADO para pasar
  const generatePipe = (): Pipe => {
    const groundHeight = 100; // Altura del suelo
    const availableHeight = height - groundHeight; // Altura total disponible
    const gapSize = PIPE_GAP; // 250px de espacio garantizado
    
    // Limites seguros para el gap - SIEMPRE DEBE HABER ESPACIO
    const minGapTop = 80; // Mínimo desde arriba
    const maxGapTop = availableHeight - gapSize - 80; // Máximo permitido
    
    // Asegurar que siempre hay espacio válido
    const safeMaxGapTop = Math.max(minGapTop, maxGapTop);
    const gapTop = Math.random() * (safeMaxGapTop - minGapTop) + minGapTop;
    
    // Calcular alturas de los tubos
    const topHeight = gapTop;
    const bottomHeight = availableHeight - gapTop - gapSize;
    
    // Debug para verificar que siempre hay espacio
    console.log(`🔧 Tubo generado: Top=${topHeight.toFixed(1)}, Gap=${gapSize}, Bottom=${bottomHeight.toFixed(1)}, Total=${(topHeight + gapSize + bottomHeight).toFixed(1)}`);
    
    return {
      x: width + 50,
      topHeight: Math.max(topHeight, 50), // Mínimo 50px para tubo superior
      bottomHeight: Math.max(bottomHeight, 50), // Mínimo 50px para tubo inferior
      passed: false,
    };
  };

  // FUNCIÓN DE COLISIÓN MEJORADA - MÁS PERMISIVA
  const checkCollision = (currentY: number, pipesArray: Pipe[]): boolean => {
    // Colisión con suelo o techo
    if (currentY <= 0 || currentY >= height - BIRD_SIZE - 100) {
      return true;
    }

    // Posición del pájaro
    const birdX = 100;
    const birdLeft = birdX;
    const birdRight = birdX + BIRD_SIZE;
    const birdTop = currentY;
    const birdBottom = currentY + BIRD_SIZE;
    
    // Hitbox más generoso - más fácil de jugar
    const hitboxMargin = 12; // Aumentado de 5 a 12 - Más permisivo
    
    // Verificar colisión con cada tubo
    for (const pipe of pipesArray) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      // Solo verificar colisión si el pájaro está en el rango horizontal del tubo
      if (birdRight - hitboxMargin > pipeLeft && birdLeft + hitboxMargin < pipeRight) {
        
        // Verificar colisión con tubo superior
        if (birdTop + hitboxMargin < pipe.topHeight) {
          console.log('💥 Colisión con tubo superior');
          return true;
        }
        
        // Verificar colisión con tubo inferior
        const pipeBottomTop = height - pipe.bottomHeight - 100;
        if (birdBottom - hitboxMargin > pipeBottomTop) {
          console.log('💥 Colisión con tubo inferior');
          return true;
        }
      }
    }

    return false;
  };

  // Saltar - UN TOQUE = UNA SUBIDA
  const jump = () => {
    if (gameOver || isDead) return;
    if (!gameStarted) {
      startGame();
      return;
    }

    // Actualizar velocidad en la referencia también
    currentBirdVelocity.current = JUMP_STRENGTH;
    setBirdVelocity(JUMP_STRENGTH);
  };

  // GAME LOOP MEJORADO - SINCRONIZACIÓN PERFECTA
  const startGame = () => {
    console.log('🎮 Iniciando Flappy Dart - ¡Lleva al pájaro lo más lejos posible!');
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPipes([]);
    
    // Inicializar referencias
    const initialY = height / 2 - 100;
    setBirdY(initialY);
    currentBirdY.current = initialY;
    setBirdVelocity(0);
    currentBirdVelocity.current = 0;
    currentPipes.current = [];
    gameRunning.current = true;
    setSavedScore(false);
    currentScore.current = 0;

    startButtonPulse.stopAnimation();
    birdAnimation.setValue(initialY);

    // Primer tubo después de 3 segundos
    setTimeout(() => {
      if (gameRunning.current) {
        const newPipe = generatePipe();
        setPipes([newPipe]);
        currentPipes.current = [newPipe];
      }
    }, 3000);

    // GAME LOOP PRINCIPAL MEJORADO
    gameLoopRef.current = setInterval(() => {
      if (!gameRunning.current) return;

      // Actualizar física del pájaro
      currentBirdVelocity.current += GRAVITY;
      currentBirdY.current += currentBirdVelocity.current;

      // Actualizar tubos
      const updatedPipes = currentPipes.current.map((pipe) => ({
        ...pipe,
        x: pipe.x - PIPE_SPEED,
      }));

      // VERIFICAR PUNTUACIÓN
      let puntosGanados = 0;
      updatedPipes.forEach((pipe) => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) {
          pipe.passed = true;
          puntosGanados++;
        }
      });

      if (puntosGanados > 0) {
        currentScore.current += puntosGanados;
        const newScore = currentScore.current;
        console.log(`🔥 PUNTOS GANADOS: +${puntosGanados}, SCORE TOTAL: ${newScore}`);
        setScore(newScore);
      }

      // VERIFICAR COLISIONES CON VALORES ACTUALES
      if (checkCollision(currentBirdY.current, updatedPipes)) {
        gameRunning.current = false;
        
        // Parar intervalos inmediatamente
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = null;
        }
        if (pipeGeneratorRef.current) {
          clearInterval(pipeGeneratorRef.current);
          pipeGeneratorRef.current = null;
        }
        
        // Capturar score actual
        const scoreCapturado = currentScore.current;
        console.log(`🎯 COLISIÓN! Score capturado: ${scoreCapturado}`);
        
        // Ejecutar handleCollision con el score correcto
        setTimeout(() => {
          handleCollision(scoreCapturado);
        }, 1);
        
        return;
      }

      // Actualizar estado visual
      setBirdY(currentBirdY.current);
      setBirdVelocity(currentBirdVelocity.current);
      birdAnimation.setValue(currentBirdY.current);

      // Filtrar tubos que salieron de pantalla
      const filteredPipes = updatedPipes.filter((pipe) => pipe.x > -PIPE_WIDTH);
      
      // Actualizar referencias y estado
      currentPipes.current = filteredPipes;
      setPipes(filteredPipes);

    }, 16); // 60 FPS

    // Generar tubos
    pipeGeneratorRef.current = setInterval(() => {
      if (gameRunning.current) {
        const newPipe = generatePipe();
        currentPipes.current = [...currentPipes.current, newPipe];
        setPipes(prev => [...prev, newPipe]);
      }
    }, PIPE_INTERVAL);
  };

  // Manejar colisión con animación de muerte
  const handleCollision = (scoreRecibido: number) => {
    console.log('💥 ¡Colisión detectada! Iniciando secuencia de muerte...');
    console.log(`🎯 Score recibido en handleCollision: ${scoreRecibido}`);
    
    if (isDead || gameOver) return; // Evitar múltiples ejecuciones
    
    const puntajeFinal = Math.max(scoreRecibido, currentScore.current, score);
    console.log(`💀 Game Over! Puntaje FINAL determinado: ${puntajeFinal} obstáculos`);
    
    Vibration.vibrate(500); 
    setIsDead(true);
    gameRunning.current = false;
    
    // Animación de muerte: rotar y caer
    Animated.parallel([
      Animated.timing(birdRotation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(birdAnimation, {
        toValue: height - 160, // Caer hasta el suelo
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Después de la animación de muerte, mostrar Game Over
      setTimeout(() => {
        endGame(puntajeFinal);
      }, 500);
    });
  };

  // Terminar juego con modal personalizado
  const endGame = (puntajeFinalRecibido?: number) => {
    if (gameOver) return;
    
    const puntajeFinal = puntajeFinalRecibido || Math.max(currentScore.current, score);
    
    console.log(`🎯 endGame llamado con puntaje: ${puntajeFinal}`);
    console.log('🔍 Llamando a guardarPuntaje con score:', puntajeFinal);
    
    setGameOver(true);
    setShowGameOverModal(true);
    
    // GUARDAR PUNTAJE CON DEBUG
    console.log('🎯 Ejecutando guardarPuntaje...');
    guardarPuntaje(puntajeFinal);
    
    // Animación del modal
    Animated.sequence([
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Reiniciar juego
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setShowGameOverModal(false);
    setIsDead(false);
    setScore(0);
    setPipes([]);
    
    // Reiniciar referencias
    const initialY = height / 2 - 100;
    setBirdY(initialY);
    currentBirdY.current = initialY;
    setBirdVelocity(0);
    currentBirdVelocity.current = 0;
    currentPipes.current = [];
    gameRunning.current = false;
    setSavedScore(false);
    currentScore.current = 0;
    
    birdAnimation.setValue(initialY);
    birdRotation.setValue(0);
    modalAnimation.setValue(0);

    // Reiniciar animaciones de inicio
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingBird, {
          toValue: -15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatingBird, {
          toValue: 15,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(startButtonPulse, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(startButtonPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
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
          { transform: [{ translateX: cloudsX }] },
        ]}
      />

      {/* Área de juego - TODA LA PANTALLA es el control */}
      {gameStarted && !isDead && (
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={jump} 
          style={styles.gameArea}
        />
      )}

      <View style={styles.overlay}>
        <Animated.View style={{ opacity: fadeIn, alignItems: 'center' }}>
          
          {/* Pantalla de inicio */}
          {!gameStarted && (
            <>
              <Text style={styles.title}>🐦 Flappy Dart</Text>
              <Text style={styles.objective}>Lleva al pájaro lo más lejos posible</Text>

              <Animated.Image
                source={{
                  uri: 'https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=204,height=204,fit=cover,f=auto/5e0df231478aa0a331a4718d09dd91a2.png',
                }}
                style={[
                  styles.bird,
                  { transform: [{ translateY: floatingBird }] }
                ]}
              />

              <Animated.View style={{ transform: [{ scale: startButtonPulse }] }}>
                <TouchableOpacity
                  style={styles.startButton}
                  activeOpacity={0.8}
                  onPress={startGame}
                >
                  <Text style={styles.startText}>🚀 Empezar</Text>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionTitle}>🎮 Cómo jugar:</Text>
                <Text style={styles.instruction}>• Un toque = el pájaro sube</Text>
                <Text style={styles.instruction}>• Sin tocar = el pájaro baja</Text>
                <Text style={styles.instruction}>• Pasa entre los tubos verdes</Text>
                <Text style={styles.instruction}>• Cada tubo superado = +1 punto</Text>
              </View>
            </>
          )}

        </Animated.View>
      </View>

      {/* Elementos del juego */}
      {gameStarted && (
        <>
          {/* Puntuación - Distancia recorrida */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.scoreLabel}>obstáculos</Text>
          </View>

          {/* Pájaro durante el juego */}
          <Animated.Image
            source={{
              uri: isDead 
                ? 'https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-dead-bird-cartoon-vector-png-image_6690749.png'
                : 'https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=204,height=204,fit=cover,f=auto/5e0df231478aa0a331a4718d09dd91a2.png',
            }}
            style={[
              styles.gameBird,
              { 
                transform: [
                  { translateY: birdAnimation },
                  { rotate: birdRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '90deg']
                    })
                  }
                ],
                opacity: isDead ? 0.9 : 1
              },
            ]}
          />

          {/* Tubos - Obstáculos */}
          {pipes.map((pipe, index) => (
            <View key={index} style={[styles.pipeContainer, { left: pipe.x }]}>
              <Animated.Image
                source={{
                  uri: 'https://flappy-bird-ebon-chi.vercel.app/assets/pipe.png',
                }}
                style={[
                  styles.pipe,
                  { height: pipe.topHeight, top: 0 },
                ]}
              />
              <Animated.Image
                source={{
                  uri: 'https://flappy-bird-ebon-chi.vercel.app/assets/pipe.png',
                }}
                style={[
                  styles.pipe,
                  { 
                    height: pipe.bottomHeight, 
                    bottom: 100,
                    transform: [{ rotate: '180deg' }]
                  },
                ]}
              />
            </View>
          ))}

          {/* Suelo */}
          <View style={styles.ground} />
        </>
      )}

      {/* Modal de Game Over personalizado */}
      {showGameOverModal && (
        <Animated.View 
          style={[
            styles.gameOverOverlay,
            {
              opacity: modalAnimation,
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.gameOverModal,
              {
                transform: [
                  {
                    scale: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1]
                    })
                  },
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0]
                    })
                  }
                ]
              }
            ]}
          >
      
            <Text style={styles.gameOverTitle}>💀 GAME OVER</Text>

            <Image 
              source={{
                uri: 'https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-dead-bird-cartoon-vector-png-image_6690749.png'
              }}
              style={styles.deadBirdModal}
            />
            
            {/* Estadísticas */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{score}</Text>
                <Text style={styles.statLabel}>Obstáculos</Text>
                <Text style={styles.statSubLabel}>Superados</Text>
              </View>
              
              <View style={styles.bestScoreBox}>
                <Text style={styles.bestScoreText}>🏆</Text>
                <Text style={styles.bestScoreLabel}>
                  {score === 0 ? '¡Sigue intentando!' : 
                   score < 5 ? '¡Buen intento!' : 
                   score < 10 ? '¡Muy bien!' : 
                   score < 20 ? '¡Excelente!' : '¡Eres un maestro!'}
                </Text>
              </View>
            </View>
            
            {/* Mensaje motivacional */}
            <Text style={styles.motivationalText}>
              {score === 0 ? 'La práctica hace al maestro' :
               score < 5 ? 'Cada intento te hace mejor' :
               score < 10 ? 'Estás mejorando mucho' :
               score < 20 ? 'Tienes gran habilidad' :
               '¡Eres increíble!'}
            </Text>
            
            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.tryAgainButton}
                onPress={resetGame}
              >
                <Text style={styles.tryAgainText}>🔄 Intentar de Nuevo</Text>
              </TouchableOpacity>
              
            </View>
          </Animated.View>
        </Animated.View>
      )}
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
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,50,0.2)',
    paddingHorizontal: 20,
  },
  gameArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  scoreContainer: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    zIndex: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  objective: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  bird: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  gameBird: {
    position: 'absolute',
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    left: 100,
    zIndex: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 35,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    marginBottom: 30,
  },
  startText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  instructionTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  pipeContainer: {
    position: 'absolute',
    width: PIPE_WIDTH,
    height: '100%',
  },
  pipe: {
    position: 'absolute',
    width: PIPE_WIDTH,
    resizeMode: 'stretch',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    backgroundColor: '#8B4513',
    borderTopWidth: 4,
    borderTopColor: '#654321',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  gameOverModal: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 5,
    borderColor: '#FFD700',
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4444',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  deadBirdModal: {
    width: 80,
    height: 80,
    marginBottom: 25,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  statBox: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statSubLabel: {
    fontSize: 12,
    color: '#666',
  },
  bestScoreBox: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  bestScoreText: {
    fontSize: 24,
    marginBottom: 5,
  },
  bestScoreLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  motivationalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  tryAgainButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tryAgainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});