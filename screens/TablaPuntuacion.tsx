import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { supabase } from '../Supabase/ConfigSupa';

const { width, height } = Dimensions.get('window');

export default function TablaPuntuacion({ navigation }: any) {
  const [puntuaciones, setPuntuaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4CAF50', '#2196F3', '#9C27B0'];
  const birds = ['🐦', '🦅', '🐤', '🐥', '🦜', '🕊️'];

  // Función para obtener datos de Supabase
  async function fetchScores() {
    try {
      console.log('🔄 Obteniendo puntuaciones de Supabase...');
      console.log('🔧 Cliente Supabase:', supabase ? 'Configurado' : 'No configurado');
      
      // Primero probemos con una consulta simple
      const { data, error } = await supabase
        .from('puntajes_usuarios')
        .select('id, usuario, puntaje, avatar_url')
        .order('puntaje', { ascending: false });

      console.log('📡 Respuesta de Supabase:');
      console.log('- Data:', data);
      console.log('- Error:', error);

      if (error) {
        console.error('❌ Error de Supabase:', error);
        console.error('❌ Código de error:', error.code);
        console.error('❌ Mensaje:', error.message);
        throw new Error(`Error Supabase: ${error.message}`);
      }

      if (!data) {
        console.log('⚠️ No se encontraron datos (data es null)');
        return [];
      }

      if (data.length === 0) {
        console.log('⚠️ Array vacío - no hay registros en la tabla');
        return [];
      }

      console.log('✅ Datos obtenidos exitosamente:');
      console.log('📊 Cantidad de registros:', data.length);
      
      // Verificar estructura del primer registro
      if (data.length > 0) {
        const registro = data[0];
        console.log('🔍 Primer registro:', {
          id: registro.id,
          usuario: registro.usuario,
          puntaje: registro.puntaje,
          avatar_url: registro.avatar_url
        });
      }

      return data;

    } catch (err: any) {
      console.error('❌ Error completo en fetchScores:', err);
      console.error('❌ Tipo de error:', typeof err);
      console.error('❌ Stack:', err.stack);
      
      // Si es un error de red o conexión
      if (err.message && err.message.includes('NetworkError')) {
        throw new Error('Error de conexión a la base de datos');
      }
      
      // Si es un error de Supabase
      if (err.message && err.message.includes('Error Supabase')) {
        throw err;
      }
      
      // Para otros errores
      throw new Error(`Error inesperado: ${err.message}`);
    }
  }

  // Función para cargar datos
  async function loadData(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await fetchScores();
      
      const enrichedData = data.map(function(item: any, index: number) {
        return {
          ...item,
          color: colors[index % colors.length],
          bird: birds[index % birds.length]
        };
      });

      setPuntuaciones(enrichedData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      Alert.alert(
        'Error',
        'No se pudieron cargar las puntuaciones. ¿Deseas reintentar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Reintentar', onPress: function() { loadData(false); } }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Efectos
  useEffect(function() {
    // Verificar que supabase esté configurado
    console.log('🔧 Verificando configuración de Supabase...');
    console.log('🔧 Supabase object:', supabase);
    console.log('🔧 Supabase tipo:', typeof supabase);
    
    if (!supabase) {
      console.error('❌ Supabase no está configurado');
      setError('Error de configuración: Supabase no está disponible');
      setLoading(false);
      return;
    }
    
    if (!(supabase as any).from) {
      console.error('❌ Supabase.from no está disponible');
      setError('Error de configuración: Métodos de Supabase no disponibles');
      setLoading(false);
      return;
    }
    
    console.log('✅ Supabase configurado correctamente');
    loadData(false);
  }, []);

  useEffect(function() {
    if (puntuaciones.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();

      // Animación de rebote del título
      function startBounce() {
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
        ]).start(startBounce);
      }
      startBounce();
    }
  }, [puntuaciones]);

  // Manejar toque en item
  function handleItemPress(itemId: any) {
    setSelectedItem(itemId);
    setTimeout(function() {
      setSelectedItem(null);
    }, 600);
  }

  // Obtener datos de ranking
  function getRankData(index: number) {
    switch (index) {
      case 0:
        return { medal: '🥇', title: 'CAMPEÓN' };
      case 1:
        return { medal: '🥈', title: 'SUBCAMPEÓN' };
      case 2:
        return { medal: '🥉', title: 'TERCER LUGAR' };
      default:
        return { medal: `${index + 1}°`, title: 'JUGADOR' };
    }
  }

  // Renderizar item de la lista
  function renderItem({ item, index }: { item: any; index: number }) {
    const rankData = getRankData(index);
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={function() { handleItemPress(item.id); }}
      >
        <View style={[
          styles.row,
          {
            backgroundColor: item.color + '15',
            borderColor: item.color + '80',
          },
          selectedItem === item.id && styles.selectedRow,
          index < 3 && styles.podiumRow
        ]}>
          
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[
              styles.avatarContainer,
              {
                backgroundColor: item.color + '30',
                borderColor: item.color,
              }
            ]}>
              {item.avatar_url ? (
                <Image 
                  source={{ uri: item.avatar_url }} 
                  style={styles.avatar}
                  onError={function() {
                    console.log('Error loading avatar for:', item.usuario);
                  }}
                />
              ) : (
                <Text style={styles.avatarPlaceholder}>👤</Text>
              )}
              <Text style={styles.birdEmoji}>{item.bird}</Text>
            </View>
          </View>

          {/* Ranking */}
          <View style={styles.rankSection}>
            <View style={[
              styles.medalContainer, 
              { backgroundColor: item.color + '20' }
            ]}>
              <Text style={styles.medalText}>{rankData.medal}</Text>
            </View>
            <Text style={styles.rankTitle}>{rankData.title}</Text>
          </View>

          {/* Información del jugador */}
          <View style={styles.playerSection}>
            <Text style={[styles.playerName, { color: item.color }]}>
              {item.usuario}
            </Text>
            <View style={styles.scoreRow}>
              <Text style={styles.pipeIcon}>🟢</Text>
              <Text style={[styles.scoreText, { color: item.color }]}>
                {item.puntaje}
              </Text>
              <Text style={styles.scoreLabel}>PUNTOS</Text>
            </View>
          </View>

         
          {index < 3 && (
            <View style={styles.crownContainer}>
              <Text style={styles.crown}>👑</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Renderizar contenido principal
  function renderContent() {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Cargando puntuaciones...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={function() { loadData(false); }}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (puntuaciones.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🎮 No hay puntuaciones</Text>
          <Text style={styles.emptySubtext}>¡Sé el primero en jugar!</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={puntuaciones}
        renderItem={renderItem}
        keyExtractor={function(item: any) { return item.id.toString(); }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={function() { 
          return <View style={styles.separator} />; 
        }}
        refreshing={refreshing}
        onRefresh={function() { loadData(true); }}
      />
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={{ uri: 'https://e0.pxfuel.com/wallpapers/488/135/desktop-wallpaper-flappy-bird-background.jpg' }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.gameOverlay} />
        
        <Animated.View 
          style={[
            styles.container, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          
        
          <View style={styles.flappyHeader}>
            <Animated.View style={[
              styles.titleContainer,
              { transform: [{ scale: bounceAnim }] }
            ]}>
              <Text style={styles.flappyTitle}>FLAPPY BIRD</Text>
              <Text style={styles.leaderboardTitle}>TABLA DE LÍDERES</Text>
            </Animated.View>
            <Text style={styles.subtitle}>🏆 MEJORES PILOTOS 🏆</Text>
          </View>

         
          <View style={styles.gameContainer}>
            <View style={styles.scoreHeader}>
              <Text style={styles.headerText}>JUGADOR</Text>
              <Text style={styles.headerText}>PUNTAJE</Text>
            </View>

            {renderContent()}
          </View>

         
          <TouchableOpacity 
            style={styles.flappyButton} 
            onPress={function() { navigation.goBack(); }}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>REGRESAR</Text>
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
  avatarSection: {
    marginRight: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    fontSize: 24,
  },
  birdEmoji: {
    fontSize: 16,
    position: 'absolute',
    bottom: -5,
    right: -5,
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
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pipeIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '900',
    marginRight: 5,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  crownContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  crown: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '700',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
  flappyButton: {
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