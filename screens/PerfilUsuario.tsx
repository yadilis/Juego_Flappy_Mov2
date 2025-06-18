import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';
import { auth, db } from '../firebase/Config';

const supabaseUrl = 'https://nyrnjnktfhiiquibwqnm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cm5qbmt0ZmhpaXF1aWJ3cW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzExNDgsImV4cCI6MjA2NDA0NzE0OH0.wRhADlUYZeGwcJh0GQ5gRKgtAklNi7oiXphjG0iQd4w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PerfilUsuario({ navigation }: any) {
  const [usuario, setUsuario] = useState('');
  const [edad, setEdad] = useState('');
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [imagen, setImagen] = useState<any>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        cargarDatosUsuario(user.uid);
      } else {
        setLoading(false);
      }
    });

    const unsubscribeNavigation = navigation.addListener('focus', () => {
      if (auth.currentUser) {
        cargarDatosUsuario(auth.currentUser.uid);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeNavigation();
    };
  }, []);

  const cargarDatosUsuario = async (uid: string) => {
    try {
      const userRef = ref(db, `usuarios/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsuario(data.usuario || 'Sin nombre');
        setEdad(data.edad || 'Sin edad');
        setCorreo(data.correo || 'Sin correo');
        setGenero(data.genero || 'Sin género');
        setExperiencia(data.experiencia || 'Sin experiencia');
        setAvatarUri(data.avatarUri || '');
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerAvatar = () => {
    if (imagen?.uri) return imagen.uri;
    if (avatarUri) return avatarUri;
    const nombre = encodeURIComponent(usuario);
    return `https://ui-avatars.com/api/?name=${nombre}&background=ff9800&color=fff&size=140`;
  };

  const pickImage = async () => {
    setModalVisible(false);
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    console.log(result);

    if (!result.canceled) {
      setImagen(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!auth.currentUser || !imagen) return;

    setSubiendoImagen(true);
    try {
      const response = await fetch(imagen.uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const avatarFile = new Uint8Array(arrayBuffer);

      const timestamp = Date.now();
      const userId = auth.currentUser.uid;
      const randomId = Math.random().toString(36).substring(2, 8);
      const nombreUnico = `avatar_${userId}_${timestamp}_${randomId}.png`;

      const fullPath = await supabase.storage
        .from('imagenes')
        .upload(
          `ima/${nombreUnico}`,
          avatarFile,
          { 
            cacheControl: '3600', 
            upsert: false 
          }
        );

      console.log(fullPath);

      const { data: urlData } = supabase.storage
        .from('imagenes')
        .getPublicUrl(`ima/${nombreUnico}`);

      await update(ref(db, `usuarios/${userId}`), {
        avatarUri: urlData.publicUrl
      });

      setAvatarUri(urlData.publicUrl);
      setImagen(null);
      
    } catch (error) {
      console.error('Error al subir imagen:', error);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Game');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#ff9800" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: obtenerAvatar() }} style={styles.avatar} />
      
      <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

      {imagen && (
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={uploadImage}
          disabled={subiendoImagen}
        >
          {subiendoImagen ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Subir</Text>
          )}
        </TouchableOpacity>
      )}
      
      <Text style={styles.nombre}>{usuario}</Text>
      <Text style={styles.email}>{correo}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Experiencia</Text>
        <Text style={styles.value}>{experiencia}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Edad</Text>
        <Text style={styles.value}>{edad}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Género</Text>
        <Text style={styles.value}>{genero}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📷 Cambiar Foto de Perfil</Text>
              <View style={styles.modalTitleUnderline} />
            </View>
            
            <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalIcon}>🖼️</Text>
                <Text style={styles.buttonText}>Seleccionar de Galería</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => {
                setModalVisible(false);
                setImagen(null);
              }}
            >
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalIcon}>❌</Text>
                <Text style={styles.buttonText}>Cancelar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#ffc107',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    shadowColor: '#ffc107',
    shadowOpacity: 0.9,
    shadowRadius: 40,
    elevation: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#ff9800',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 25,
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  loadingText: {
    marginTop: 15,
    color: '#ff9800',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff9800',
    marginHorizontal: 3,
  },
  dot1: { opacity: 0.3 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 1 },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'cover',
    borderWidth: 5,
    borderColor: '#ffc107',
    shadowColor: '#ff9800',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 20,
  },
  avatarBorder: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    top: -10,
    left: -10,
  },
  avatarGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    top: -20,
    left: -20,
    shadowColor: '#ff9800',
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#388E3C',
    transform: [{ scale: 1 }],
  },
  uploadButton: {
    backgroundColor: '#FF9800',
    borderColor: '#F57C00',
    shadowColor: '#FF9800',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 2,
    minWidth: 120,
    alignItems: 'center',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#ff3d00',
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#ff1744',
    shadowOpacity: 1,
    shadowRadius: 35,
    elevation: 40,
    borderWidth: 2,
    borderColor: '#ffebee',
    transform: [{ scale: 1 }],
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  nombre: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ff9800',
    marginBottom: 8,
    textShadowColor: '#ff6f00',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 253, 231, 0.9)',
    borderRadius: 20,
    padding: 25,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffb300',
    shadowColor: '#ffb300',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 16,
    color: '#4a2700',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ff9800',
    textShadowColor: '#ff6f00',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffc107',
    shadowColor: '#ffc107',
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 30,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ff9800',
    textAlign: 'center',
    textShadowColor: '#ff6f00',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    letterSpacing: 1,
  },
  modalTitleUnderline: {
    width: 80,
    height: 3,
    backgroundColor: '#ffc107',
    marginTop: 8,
    borderRadius: 2,
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#2196F3',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#2196F3',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  cancelButton: {
    backgroundColor: '#ff5722',
    shadowColor: '#ff5722',
    borderColor: '#d84315',
  },
  modalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIcon: {
    fontSize: 22,
    marginRight: 12,
  },
});