import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, ImageBackground, Animated, Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase/Config';

const RegistroScreen = ({ navigation }: any) => {
  const [usuario, setUsuario] = useState('');
  const [edad, setEdad] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [genero, setGenero] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registro = async () => {
    setError('');

    if (!usuario.trim() || !edad.trim() || !correo.trim() || !contrasena.trim() || !confirmarContrasena.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
     
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      //  Guardar info extra en Realtime Database
      await set(ref(db, 'usuarios/' + user.uid), {
     
        usuario,
        edad,
        correo,
        genero,
        experiencia,
        
      });

      setLoading(false);
      alert('Usuario registrado correctamente');
      navigation.navigate('Login');
    } catch (error: any) {
      setLoading(false);
      setError('Error al registrar: ' + error.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://media.indiedb.com/images/games/1/61/60262/Flappy_Bird_XMas_icon.1.png' }}
      style={styles.img}
      imageStyle={{ opacity: 0.85 }}
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>¡Crea tu cuenta!</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#999"
            value={usuario}
            onChangeText={setUsuario}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Edad"
            placeholderTextColor="#999"
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#999"
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
            secureTextEntry
            editable={!loading}
          />

          <Picker
            selectedValue={genero}
            onValueChange={setGenero}
            enabled={!loading}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona tu género" value="" />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Femenino" value="femenino" />
            <Picker.Item label="Otro" value="otro" />
          </Picker>

          <Picker
            selectedValue={experiencia}
            onValueChange={setExperiencia}
            enabled={!loading}
            style={styles.picker}
          >
            <Picker.Item label="Nivel de experiencia" value="" />
            <Picker.Item label="Principiante" value="principiante" />
            <Picker.Item label="Intermedio" value="intermedio" />
            <Picker.Item label="Avanzado" value="avanzado" />
          </Picker>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={registro}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  img: { flex: 1, resizeMode: 'cover' },
  overlay: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 40,
    backgroundColor: 'rgba(25, 120, 230, 0.85)',
  },
  container: {
    width: '100%', maxWidth: 420, backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 30, borderWidth: 3, borderColor: '#ffc107',
    paddingVertical: 40, paddingHorizontal: 30, alignItems: 'center',
    shadowColor: '#ff4081', shadowOpacity: 0.9, shadowRadius: 30, elevation: 40,
  },
  title: {
    fontSize: 32, fontWeight: '900', color: '#ff9800', marginBottom: 30,
    fontFamily: 'Comic Sans MS', textShadowColor: '#ff6f00',
    textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 12,
    letterSpacing: 2, textAlign: 'center',
  },
  input: {
    width: '100%', height: 55, backgroundColor: '#fffde7',
    borderRadius: 16, marginBottom: 15, paddingHorizontal: 20,
    color: '#333', fontSize: 18, fontWeight: '700',
    borderWidth: 2, borderColor: '#ffb300',
    shadowColor: '#ffb300', shadowOpacity: 0.6, shadowRadius: 12, elevation: 5,
  },
  picker: {
    width: '100%', height: 55, backgroundColor: '#fffde7',
    borderRadius: 16, marginBottom: 20, color: '#333',
    borderWidth: 2, borderColor: '#ffb300',
  },
  button: {
    width: '100%', paddingVertical: 18, backgroundColor: '#ffb300',
    borderRadius: 25, alignItems: 'center', marginTop: 15,
    shadowColor: '#ffa000', shadowOpacity: 0.9, shadowRadius: 30, elevation: 30,
    borderWidth: 1.5, borderColor: '#fff8e1',
  },
  buttonDisabled: { backgroundColor: '#cc8a00' },
  buttonText: {
    color: '#4a2700', fontWeight: '900', fontSize: 22,
    letterSpacing: 2, textTransform: 'uppercase',
    textShadowColor: '#fff3e0', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3,
  },
  link: {
    color: '#20272F', marginTop: 18, fontSize: 16, fontWeight: '700',
    textDecorationLine: 'underline', textAlign: 'center',
  },
  error: {
    color: '#ff3d00', marginBottom: 15, fontWeight: '800', textAlign: 'center', fontSize: 16,
  },
});

export default RegistroScreen;
