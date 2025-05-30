import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function PerfilUsuario() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://omotesandoplants.com/cdn/shop/articles/que-significado-tienen-las-rosas-preservadas-y-sus-diferentes-colores-128334.webp?v=1712070872&width=720' }} 
        style={styles.avatar}
      />
      <Text style={styles.nombre}>Rosita Quezada</Text>
      <Text style={styles.email}>rositaquezada@gmail.com</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nivel</Text>
        <Text style={styles.value}>Avanzado</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Puntaje Máximo</Text>
        <Text style={styles.value}>120</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(25, 120, 230, 0.85)', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#ffc107', 
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    shadowColor: '#ffc107',
    shadowOpacity: 0.85,
    shadowRadius: 30,
    elevation: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ff9800',
    marginBottom: 30,
    fontFamily: 'Comic Sans MS',
    textShadowColor: '#ff6f00',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 12,
    letterSpacing: 2,
    textAlign: 'center',
  },
  animatedContainer: {
    width: 140,
    height: 140,
    marginBottom: 20,
    shadowColor: '#ffcc00',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    resizeMode: 'cover',
    borderWidth: 4,
    borderColor: '#ffc107',
  },
  nombre: {
    fontSize: 28,
    fontWeight: '400',
    color: '#ff9800',
    marginBottom: 8,
    textShadowColor: '#ff6f00',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    color: '#20272F',
    marginBottom: 25,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: '#20272F',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#fffde7',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffb300',
    shadowColor: '#ffb300',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 15,
  },
  label: {
    fontSize: 16,
    color: '#4a2700',
    fontWeight: '500',
    marginBottom: 5,
    letterSpacing: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: '500',
    color: '#ff9800',
    textShadowColor: '#ff6f00',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: '#ffb300',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#ffa000',
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 30,
    borderWidth: 1.5,
    borderColor: '#fff8e1',
  },
  logoutButton: {
    backgroundColor: '#ff3d00',
    shadowColor: '#ff1744',
    borderColor: '#ffebee',
  },
  buttonText: {
    color: '#4a2700',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#fff3e0',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});