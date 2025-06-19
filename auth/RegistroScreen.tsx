import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, ImageBackground
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../firebase/ConfigSupa';

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

    // Validaciones
    if (
      !usuario.trim() || !edad.trim() || !correo.trim() ||
      !contrasena.trim() || !confirmarContrasena.trim() ||
      !genero.trim() || !experiencia.trim()
    ) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Validar email con regex simple
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Validar edad numérica y positiva
    const edadNumber = Number(edad);
    if (isNaN(edadNumber) || edadNumber <= 0) {
      setError('Por favor ingresa una edad válida.');
      return;
    }

    setLoading(true);

    try {
      // Registro en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: correo,
        password: contrasena,
      });

      if (signUpError) throw signUpError;

      const user = data.user;
      const userId = user?.id;

      // Insertar datos adicionales en tabla usuarios
      const { error: insertError } = await supabase
        .from('perfil_usuarios')
        .insert([
          {
            id: userId,
            usuario,
            edad: edadNumber,
            correo,
            genero,
            experiencia,
          },
        ]);

      if (insertError) throw insertError;

      alert('Usuario registrado correctamente');
      navigation.navigate('Login');

    } catch (error: any) {
      const message = error?.message || String(error);
      setError('Error al registrar: ' + message);
    } finally {
      setLoading(false);
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
            placeholder="Nombre de usuario"
            value={usuario}
            onChangeText={setUsuario}
          />

          <TextInput
            style={styles.input}
            placeholder="Edad"
            keyboardType="numeric"
            value={edad}
            onChangeText={setEdad}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
          />

          <Picker
            selectedValue={genero}
            style={styles.picker}
            onValueChange={(itemValue) => setGenero(itemValue)}
          >
            <Picker.Item label="Selecciona tu género" value="" />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Femenino" value="femenino" />
            <Picker.Item label="Otro" value="otro" />
          </Picker>

          <Picker
            selectedValue={experiencia}
            style={styles.picker}
            onValueChange={(itemValue) => setExperiencia(itemValue)}
          >
            <Picker.Item label="¿Has jugado antes?" value="" />
            <Picker.Item label="Sí" value="si" />
            <Picker.Item label="No" value="no" />
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
