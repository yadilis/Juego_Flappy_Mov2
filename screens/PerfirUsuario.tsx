import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function PerfilUsuario() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=3' }} // Imagen mock
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginTop: 30,
    marginBottom: 15,
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  email: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },
  infoBox: {
    width: '90%',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#475569',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
