import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const puntuacionesMock = [
  { id: '1', nombre: 'Rosita', puntuacion: 120 },
  { id: '2', nombre: 'Lisa', puntuacion: 100 },
  { id: '3', nombre: 'Milhouse', puntuacion: 85 },
  { id: '4', nombre: 'Nelson', puntuacion: 70 },
];

export default function TablaPuntuacion() {
  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Text style={styles.cell}>{item.puntuacion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Tabla de Puntuaciones</Text>

      <View style={styles.header}>
        <Text style={[styles.cell, styles.headerText]}>#</Text>
        <Text style={[styles.cell, styles.headerText]}>Jugador</Text>
        <Text style={[styles.cell, styles.headerText]}>Puntos</Text>
      </View>

      <FlatList
        data={puntuacionesMock}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#ffc107', 
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#ffc107',
    shadowOpacity: 0.85,
    shadowRadius: 30,
    elevation: 40,
    marginVertical: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#ff9800', 
    marginBottom: 30,
    fontFamily: 'Comic Sans MS',
    textShadowColor: '#ff6f00',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 12,
    letterSpacing: 2,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#ffb300',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#ffa000',
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 30,
    borderWidth: 2,
    borderColor: '#fff8e1',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 6,
    shadowColor: '#ffb300',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#20272F',
  },
  headerText: {
    fontWeight: '900',
    color: '#4a2700',
    fontSize: 20,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#fff3e0',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});