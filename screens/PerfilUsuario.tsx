import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, TouchableOpacity, ActivityIndicator, Modal,
  Alert, ScrollView, StyleSheet, Dimensions 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import atob from 'atob';

import { supabase } from '../Supabase/ConfigSupa';
import { User } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Tipos simples
interface Props {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function PerfilUsuario({ navigation }: Props) {
  // Estados básicos
  const [usuario, setUsuario] = useState<string>('');
  const [edad, setEdad] = useState<number | null>(null);
  const [correo, setCorreo] = useState<string>('');
  const [genero, setGenero] = useState<string>('');
  const [experiencia, setExperiencia] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarUri, setAvatarUri] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [creandoPerfil, setCreandoPerfil] = useState<boolean>(false);

  // Cuando se carga el componente
  useEffect(() => {
    inicializarUsuario();
  }, []);

  // Función para inicializar usuario
  const inicializarUsuario = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error obteniendo sesión:', error);
        setLoading(false);
        return;
      }

      if (data.session) {
        setCurrentUser(data.session.user);
        await cargarDatosUsuario(data.session.user.id);
      } else {
        setLoading(false);
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error inicializando usuario:', error);
      setLoading(false);
    }
  };

  // Función para cargar datos del usuario
  const cargarDatosUsuario = async (userId: string): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('perfil_usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No existe el perfil, crear uno nuevo
        console.log('Perfil no encontrado, creando...');
        await crearPerfil(userId);
        return;
      } else if (error) {
        throw error;
      }

      if (data) {
        // Cargar datos en los estados
        setUsuario(data.usuario || '');
        setEdad(data.edad || null);
        setCorreo(data.correo || '');
        setGenero(data.genero || '');
        setExperiencia(data.experiencia || '');
        
        if (data.avatar_url) {
          console.log('Avatar cargado:', data.avatar_url);
          setAvatarUri(data.avatar_url);
        } else {
          console.log('No hay avatar');
          setAvatarUri('');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
      console.error('Error cargarDatosUsuario:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear perfil nuevo
  const crearPerfil = async (userId: string): Promise<void> => {
    if (creandoPerfil) {
      console.log('Ya se está creando un perfil...');
      return;
    }

    try {
      setCreandoPerfil(true);
      
      if (!userId) {
        console.error('UserId no válido');
        return;
      }

      // Verificar si ya existe
      const { data: existe } = await supabase
        .from('perfil_usuarios')
        .select('id')
        .eq('id', userId)
        .single();

      if (existe) {
        console.log('Perfil ya existe, cargando...');
        await cargarDatosUsuario(userId);
        return;
      }

      // Obtener datos del usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const nombreUsuario = user.user_metadata?.full_name || 
                             user.email?.split('@')[0] || 
                             'Usuario';
        
        console.log('Creando perfil para:', userId);
        
        // Crear perfil con UPSERT
        const { data, error } = await supabase
          .from('perfil_usuarios')
          .upsert([
            {
              id: userId,
              usuario: nombreUsuario,
              correo: user.email || '',
              edad: null,
              genero: '',
              experiencia: 'Novato',
              avatar_url: null
            }
          ], {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (error) {
          if (!error.message.includes('duplicate key value')) {
            console.error('Error creando perfil:', error);
            throw error;
          } else {
            console.log('Perfil ya existía');
            await cargarDatosUsuario(userId);
            return;
          }
        }

        if (data) {
          console.log('Perfil creado exitosamente');
          setUsuario(data.usuario || '');
          setEdad(data.edad || null);
          setCorreo(data.correo || '');
          setGenero(data.genero || '');
          setExperiencia(data.experiencia || '');
          
          if (data.avatar_url) {
            setAvatarUri(data.avatar_url);
          } else {
            setAvatarUri('');
          }
        }
      }
    } catch (error: any) {
      if (!error.message?.includes('duplicate key value')) {
        console.error('Error creando perfil:', error.message);
      } else {
        console.log('El perfil ya existe');
      }
    } finally {
      setCreandoPerfil(false);
    }
  };

  // Función para obtener avatar
  const obtenerAvatar = (): string => {
    if (imagen?.uri) {
      return imagen.uri;
    }
    if (avatarUri) {
      return avatarUri;
    }
    
    const nombre = encodeURIComponent(usuario || 'Usuario');
    return `https://ui-avatars.com/api/?name=${nombre}&background=FFD700&color=333&size=160&bold=true`;
  };

  // Función para pedir permisos de galería
  const pedirPermisosGaleria = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se necesitan permisos para la galería');
      return false;
    }
    return true;
  };

  // Función para pedir permisos de cámara
  const pedirPermisosCamara = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se necesitan permisos para la cámara');
      return false;
    }
    return true;
  };

  // Función para seleccionar imagen de galería
  const seleccionarImagen = async (): Promise<void> => {
    setModalVisible(false);
    const tienePermisos = await pedirPermisosGaleria();
    if (!tienePermisos) return;

    try {
      let resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        console.log('Imagen seleccionada');
        setImagen(resultado.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      console.error('Error seleccionarImagen:', error);
    }
  };

  // Función para tomar foto
  const tomarFoto = async (): Promise<void> => {
    setModalVisible(false);
    const tienePermisos = await pedirPermisosCamara();
    if (!tienePermisos) return;

    try {
      let resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        console.log('Foto tomada');
        setImagen(resultado.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
      console.error('Error tomarFoto:', error);
    }
  };

  // Función para subir imagen - CORREGIDA
  const subirImagen = async (): Promise<void> => {
    if (!currentUser || !imagen) {
      Alert.alert('Error', 'No hay usuario o imagen');
      return;
    }

    setSubiendoImagen(true);
    console.log('Subiendo imagen...');

    try {
      // Leer imagen como base64
      const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convertir a bytes
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Crear nombre único
      const timestamp = Date.now();
      const userId = currentUser.id;
      const randomId = Math.random().toString(36).substring(2, 8);
      const nombreArchivo = `avatar_${userId}_${timestamp}_${randomId}.png`;

      console.log('Subiendo archivo:', nombreArchivo);

      // Subir a Storage
      const { error: errorSubida } = await supabase.storage
        .from('imagenes')
        .upload(`avatars/${nombreArchivo}`, bytes, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/png',
        });

      if (errorSubida) {
        console.error('Error subiendo:', errorSubida);
        throw errorSubida;
      }

      console.log('Imagen subida exitosamente');

      // Obtener URL pública
      const { data } = supabase.storage
        .from('imagenes')
        .getPublicUrl(`avatars/${nombreArchivo}`);

      const urlPublica = data.publicUrl;
      console.log('URL generada:', urlPublica);

      // CORRECCIÓN: Usar UPDATE en lugar de UPSERT
      const { error: errorActualizar } = await supabase
        .from('perfil_usuarios')
        .update({ avatar_url: urlPublica })
        .eq('id', userId);

      if (errorActualizar) {
        console.error('Error guardando URL:', errorActualizar);
        throw errorActualizar;
      }

      console.log('URL guardada en base de datos');

      // Actualizar estado local
      setAvatarUri(urlPublica);
      setImagen(null);

      Alert.alert('¡Genial! 🎉', 'Foto actualizada correctamente');

    } catch (error: any) {
      console.error('Error en subirImagen:', error);
      Alert.alert('Error', 'No se pudo subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
      console.error('Error cerrarSesion:', error);
    }
  };

  // Pantalla de carga
  if (loading) {
    return (
      <LinearGradient
        colors={['#87CEEB', '#98D8E8', '#B8E6F0']}
        style={styles.loadingContainer}
      >
        <View style={styles.birdLoader}>
          <Text style={styles.birdEmoji}>🐦</Text>
          <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
        </View>
        <Text style={styles.loadingText}>Cargando tu perfil...</Text>
      </LinearGradient>
    );
  }

  // Pantalla principal
  return (
    <LinearGradient
      colors={['#87CEEB', '#98D8E8', '#B8E6F0']}
      style={styles.backgroundGradient}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil 🐦</Text>
          <View style={styles.cloudsContainer}>
            <Text style={styles.cloud}>☁️</Text>
            <Text style={[styles.cloud, styles.cloud2]}>☁️</Text>
            <Text style={[styles.cloud, styles.cloud3]}>☁️</Text>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: obtenerAvatar() }} 
              style={styles.avatar} 
              onError={(error) => console.log('Error imagen:', error.nativeEvent.error)}
            />
            <View style={styles.avatarBorder} />
            {imagen && <View style={styles.newImageIndicator} />}
          </View>

          <TouchableOpacity 
            onPress={() => setModalVisible(true)} 
            style={styles.editButton}
          >
            <Text style={styles.editText}>📸 Cambiar Foto</Text>
          </TouchableOpacity>

          {imagen && (
            <TouchableOpacity 
              onPress={subirImagen}
              disabled={subiendoImagen}
              style={[styles.uploadButton, subiendoImagen && styles.buttonDisabled]}
            >
              {subiendoImagen ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.uploadingText}>Subiendo...</Text>
                </View>
              ) : (
                <Text style={styles.uploadText}>✨ Guardar Imagen</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Información del usuario */}
        <View style={styles.userCard}>
          <Text style={styles.username}>{usuario || 'Jugador'}</Text>
          <Text style={styles.email}>{correo}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statLabel}>Experiencia</Text>
              <Text style={styles.statValue}>{experiencia || 'Novato'}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🎂</Text>
              <Text style={styles.statLabel}>Edad</Text>
              <Text style={styles.statValue}>{edad || '--'}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👤</Text>
              <Text style={styles.statLabel}>Género</Text>
              <Text style={styles.statValue}>{genero || '--'}</Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.actionsContainer}>
          
          <TouchableOpacity 
            onPress={cerrarSesion}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Decoración */}
        <View style={styles.ground}>
          <Text style={styles.grassEmoji}>🌱🌿🌱🌿🌱</Text>
        </View>
    
      </ScrollView>

      {/* Modal para seleccionar imagen */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>📷 Cambiar Foto de Perfil</Text>
            <Text style={styles.modalSubtitle}>¿Cómo quieres obtener tu nueva foto?</Text>

            <TouchableOpacity onPress={seleccionarImagen} style={styles.modalButton}>
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalButtonEmoji}>🖼️</Text>
                <Text style={styles.modalButtonText}>Galería</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={tomarFoto} style={styles.modalButton}>
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalButtonEmoji}>📸</Text>
                <Text style={styles.modalButtonText}>Cámara</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                setImagen(null);
              }} 
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelText}>❌ Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  birdLoader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  birdEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  loader: {
    marginTop: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#2E7D99',
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2E7D99',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cloudsContainer: {
    position: 'absolute',
    top: -20,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cloud: {
    fontSize: 30,
    opacity: 0.7,
  },
  cloud2: {
    fontSize: 25,
    marginTop: 10,
  },
  cloud3: {
    fontSize: 35,
    marginTop: -5,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#FFD700',
  },
  avatarBorder: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 88,
    borderWidth: 4,
    borderColor: '#FF6B35',
    opacity: 0.6,
  },
  newImageIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  uploadText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  username: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2E7D99',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D99',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: '#2E7D99',
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
  },
  ground: {
    alignItems: 'center',
    marginTop: 20,
  },
  grassEmoji: {
    fontSize: 20,
    opacity: 0.6,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    color: '#2E7D99',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 8,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});