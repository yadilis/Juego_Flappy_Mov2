import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, TouchableOpacity, ActivityIndicator, Modal,
  Alert, ScrollView, StyleSheet, Dimensions 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import atob from 'atob';

import { supabase } from '../firebase/ConfigSupa';
import { User } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';



const { width } = Dimensions.get('window');

interface NavigationProp {
  navigate: (screen: string) => void;
  addListener?: (event: string, callback: () => void) => () => void;
}

interface PerfilUsuarioProps {
  navigation: NavigationProp;
}

export default function PerfilUsuario({ navigation }: PerfilUsuarioProps) {
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setCurrentUser(data.session.user);
        cargarDatosUsuario(data.session.user.id);
      } else {
        setLoading(false);
        navigation.navigate('Login');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        cargarDatosUsuario(session.user.id);
      } else {
        setCurrentUser(null);
        navigation.navigate('Login');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function cargarDatosUsuario(userId: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('perfil_usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUsuario(data.usuario || '');
        setEdad(data.edad || null);
        setCorreo(data.correo || '');
        setGenero(data.genero || '');
        setExperiencia(data.experiencia || '');
        setAvatarUri(data.avatar_uri || '');
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil');
      console.error('Error cargarDatosUsuario:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const obtenerAvatar = (): string => {
    if (imagen?.uri) return imagen.uri;
    if (avatarUri) return avatarUri;
    const nombre = encodeURIComponent(usuario || 'Usuario');
    return `https://ui-avatars.com/api/?name=${nombre}&background=FFD700&color=333&size=160&bold=true`;
  };

  const requestGalleryPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se necesitan permisos para acceder a la galería de fotos.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se necesitan permisos para acceder a la cámara.');
      return false;
    }
    return true;
  };

  const pickImage = async (): Promise<void> => {
    setModalVisible(false);
    const hasPermission = await requestGalleryPermissions();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImagen(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const takePhoto = async (): Promise<void> => {
    setModalVisible(false);
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImagen(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const uploadImage = async (): Promise<void> => {
    if (!currentUser || !imagen) {
      Alert.alert('Error', 'No hay usuario autenticado o imagen seleccionada');
      return;
    }

    setSubiendoImagen(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const timestamp = Date.now();
      const userId = currentUser.id;
      const randomId = Math.random().toString(36).substring(2, 8);
      const nombreUnico = `avatar_${userId}_${timestamp}_${randomId}.png`;

      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(`avatars/${nombreUnico}`, bytes, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/png',
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('imagenes')
        .getPublicUrl(`avatars/${nombreUnico}`);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from('perfil_usuarios')
        .update({ avatar_uri: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setAvatarUri(publicUrl);
      setImagen(null);
      Alert.alert('¡Genial! 🎉', 'Tu foto de perfil se actualizó correctamente');

    } catch (error: any) {
      Alert.alert('¡Ups! 😅', 'No se pudo subir la imagen, inténtalo de nuevo');
      console.error('uploadImage error:', error.message);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const cerrarSesion = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
      console.error('cerrarSesion error:', error);
    }
  };

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

  return (
    <LinearGradient
      colors={['#87CEEB', '#98D8E8', '#B8E6F0']}
      style={styles.backgroundGradient}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header con nubes decorativas */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil 🐦</Text>
          <View style={styles.cloudsContainer}>
            <Text style={styles.cloud}>☁️</Text>
            <Text style={[styles.cloud, styles.cloud2]}>☁️</Text>
            <Text style={[styles.cloud, styles.cloud3]}>☁️</Text>
          </View>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: obtenerAvatar() }} style={styles.avatar} />
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
              onPress={uploadImage}
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

        {/* User Info Card */}
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

  
    
      </ScrollView>

      {/* Modal Mejorado */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>📷 Cambiar Foto de Perfil</Text>
            <Text style={styles.modalSubtitle}>¿Cómo quieres obtener tu nueva foto?</Text>

            <TouchableOpacity onPress={pickImage} style={styles.modalButton}>
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalButtonEmoji}>🖼️</Text>
                <Text style={styles.modalButtonText}>Galería</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={takePhoto} style={styles.modalButton}>
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