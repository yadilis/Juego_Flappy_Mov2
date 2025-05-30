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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#334155',
  },
  headerText: {
    fontWeight: '600',
    color: '#0F172A',
  },
});
