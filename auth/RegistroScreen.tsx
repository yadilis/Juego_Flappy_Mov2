import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, ImageBackground
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../Supabase/ConfigSupa';

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
  img: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  
  overlay: {
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 20, // un poco más reducido para móviles
    paddingVertical: 30,
    backgroundColor: 'rgba(30, 144, 255, 0.95)',
    position: 'relative',
  },
  
  skyLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(135, 206, 250, 0.8)',
  },
  
  skyLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(173, 216, 230, 0.6)',
  },
  
  cloudFloat1: {
    position: 'absolute',
    top: '12%',
    left: '8%',
    fontSize: 35, // menos tamaño para móvil
    color: 'rgba(255, 255, 255, 0.7)',
    textShadowColor: 'rgba(173, 216, 230, 0.8)',
    textShadowRadius: 20,
    transform: [{ scale: 1 }],
  },
  
  cloudFloat2: {
    position: 'absolute',
    top: '22%',
    right: '12%',
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.6)',
    textShadowColor: 'rgba(173, 216, 230, 0.7)',
    textShadowRadius: 15,
  },
  
  cloudFloat3: {
    position: 'absolute',
    bottom: '18%',
    left: '18%',
    fontSize: 30,
    color: 'rgba(255, 255, 255, 0.5)',
    textShadowColor: 'rgba(173, 216, 230, 0.6)',
    textShadowRadius: 12,
  },
  
  container: {
    width: '90%', // para adaptarse a pantallas móviles
    maxWidth: 380, 
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 25, // menos radio para mejor ajuste móvil
    borderWidth: 4, 
    borderColor: '#FFD700',
    paddingVertical: 40, 
    paddingHorizontal: 25, 
    alignItems: 'center',
    shadowColor: '#FF4500', 
    shadowOpacity: 0.8, 
    shadowRadius: 20, 
    elevation: 15,
    shadowOffset: { width: 0, height: 8 },
    position: 'relative',
    overflow: 'visible',
  },
  
  containerFrame: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.6)',
    backgroundColor: 'transparent',
  },
  
  containerGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  
  cornerDecor: {
    position: 'absolute',
    fontSize: 18, // más pequeño en móviles
    color: '#FFD700',
    textShadowColor: '#FF6347',
    textShadowRadius: 10,
    fontWeight: '900',
  },
  
  cornerTopLeft: {
    top: 10,
    left: 12,
    transform: [{ rotateZ: '-15deg' }],
  },
  
  cornerTopRight: {
    top: 10,
    right: 12,
    transform: [{ rotateZ: '15deg' }],
  },
  
  cornerBottomLeft: {
    bottom: 10,
    left: 12,
    transform: [{ rotateZ: '15deg' }],
  },
  
  cornerBottomRight: {
    bottom: 10,
    right: 12,
    transform: [{ rotateZ: '-15deg' }],
  },
  
  title: {
    fontSize: 32, // más pequeño para celular
    fontWeight: '900', 
    color: '#FF4500',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 3, height: 3 }, 
    textShadowRadius: 18,
    letterSpacing: 3,
    position: 'relative',
    zIndex: 10,
  },
  
  titleNeon: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFF00',
    textShadowColor: '#FFD700',
    textShadowRadius: 30,
    opacity: 0.6,
    zIndex: 5,
  },
  
  title3D: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: '900',
    color: '#FF6347',
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 2,
    zIndex: 1,
    transform: [{ translateX: 1.5 }, { translateY: 1.5 }],
  },
  
  birdDecor: {
    fontSize: 50, // menos tamaño para móvil
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#FF6347',
    textShadowRadius: 25,
    transform: [
      { rotateZ: '-5deg' },
      { scale: 1 }
    ],
    position: 'relative',
    zIndex: 15,
  },
  
  birdShadow: {
    position: 'absolute',
    fontSize: 50,
    color: 'rgba(255, 99, 71, 0.4)',
    transform: [
      { translateX: 5 },
      { translateY: 5 },
      { rotateZ: '-5deg' },
      { scale: 1 }
    ],
    zIndex: 5,
  },
  
  input: {
    width: '100%', 
    height: 55, // un poco más pequeño para móvil
    backgroundColor: '#FFFEF7',
    borderRadius: 20, 
    marginBottom: 15, 
    paddingHorizontal: 20,
    color: '#2F4F4F', 
    fontSize: 16, // tamaño legible para móvil
    fontWeight: '700',
    borderWidth: 3, 
    borderColor: '#FF6347',
    shadowColor: '#FF4500', 
    shadowOpacity: 0.7, 
    shadowRadius: 15, 
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    position: 'relative',
  },
  
  inputGlow: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  
  inputFocused: {
    borderColor: '#FF1493',
    backgroundColor: '#FFF8DC',
    transform: [{ scale: 1.02 }],
    shadowColor: '#FF1493',
    shadowRadius: 20,
    borderWidth: 4,
  },
  
  picker: {
    width: '100%', 
    height: 55, 
    backgroundColor: '#FFFEF7',
    borderRadius: 20, 
    marginBottom: 20, 
    color: '#2F4F4F',
    borderWidth: 3, 
    borderColor: '#FF6347',
    shadowColor: '#FF4500',
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 8,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  
  button: {
    width: '100%', 
    paddingVertical: 18, 
    backgroundColor: '#FF6B35',
    borderRadius: 30, 
    alignItems: 'center', 
    marginTop: 20,
    shadowColor: '#FF4500', 
    shadowOpacity: 0.9, 
    shadowRadius: 25, 
    elevation: 25,
    borderWidth: 3, 
    borderColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    position: 'relative',
    overflow: 'visible',
  },
  
  buttonGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  
  buttonGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(139, 0, 0, 0.25)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  
  buttonOuterGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    zIndex: -1,
  },
  
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    shadowRadius: 20,
    elevation: 20,
  },
  
  buttonDisabled: { 
    backgroundColor: '#CD853F',
    shadowOpacity: 0.3,
    borderColor: '#CCC',
  },
  
  buttonText: {
    color: '#FFFFFF', 
    fontWeight: '900', 
    fontSize: 20,
    letterSpacing: 3, 
    textTransform: 'uppercase',
    textShadowColor: '#8B0000', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 6,
    zIndex: 10,
    position: 'relative',
  },
  
  buttonTextGlow: {
    position: 'absolute',
    color: '#FFFF00',
    opacity: 0.5,
    textShadowColor: '#FFD700',
    textShadowRadius: 20,
    zIndex: 5,
  },
  
  buttonText3D: {
    position: 'absolute',
    color: '#FF4500',
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
    zIndex: 1,
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  
  link: {
    color: '#4169E1',
    marginTop: 20, 
    fontSize: 16, 
    fontWeight: '800',
    textDecorationLine: 'underline', 
    textAlign: 'center',
    textShadowColor: '#87CEEB',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(135, 206, 235, 0.2)',
  },
  
  linkPressed: {
    color: '#FF1493',
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    transform: [{ scale: 1.05 }],
  },
  
  error: {
    color: '#DC143C',
    marginBottom: 20, 
    fontWeight: '900', 
    textAlign: 'center', 
    fontSize: 16,
    textShadowColor: '#FFB6C1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
    backgroundColor: 'rgba(255, 182, 193, 0.4)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FF69B4',
    shadowColor: '#FF1493',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  
  scoreContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 3,
    borderColor: '#FF6347',
    marginBottom: 20,
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 15,
    position: 'relative',
    overflow: 'visible',
  },
  
  scoreGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    shadowColor: '#FFD700',
    shadowOpacity: 0.7,
    shadowRadius: 15,
    zIndex: -1,
  },
  
  scoreText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#8B0000',
    textAlign: 'center',
    textShadowColor: '#FFFF00',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 9,
    letterSpacing: 2,
    position: 'relative',
    zIndex: 5,
  },
  
  sparkle1: {
    position: 'absolute',
    top: '12%',
    left: '12%',
    color: '#FFD700',
    fontSize: 12,
    textShadowColor: '#FFFF00',
    textShadowRadius: 15,
    opacity: 0.8,
    transform: [{ rotateZ: '45deg' }],
  },
  
  sparkle2: {
    position: 'absolute',
    top: '18%',
    right: '18%',
    color: '#FF6347',
    fontSize: 10,
    textShadowColor: '#FFD700',
    textShadowRadius: 12,
    opacity: 0.7,
    transform: [{ rotateZ: '-30deg' }],
  },
  
  sparkle3: {
    position: 'absolute',
    bottom: '18%',
    left: '20%',
    color: '#FF1493',
    fontSize: 11,
    textShadowColor: '#FFFF00',
    textShadowRadius: 14,
    opacity: 0.6,
    transform: [{ rotateZ: '60deg' }],
  },
  
  sparkle4: {
    position: 'absolute',
    bottom: '28%',
    right: '12%',
    color: '#00CED1',
    fontSize: 14,
    textShadowColor: '#FFFF00',
    textShadowRadius: 18,
    opacity: 0.9,
    transform: [{ rotateZ: '-45deg' }],
  },
  
  bounce: {
    transform: [
      { translateY: -6 },
      { scale: 1.04 }
    ],
  },
  
  pulse: {
    transform: [{ scale: 1.1 }],
    shadowRadius: 40,
    shadowOpacity: 0.9,
  },
  
  shake: {
    transform: [
      { translateX: 1.5 },
      { rotateZ: '0.7deg' }
    ],
  },
  
  floatingElement1: {
    position: 'absolute',
    top: '28%',
    left: '7%',
    fontSize: 16,
    color: 'rgba(255, 215, 0, 0.6)',
    textShadowColor: '#FFD700',
    textShadowRadius: 15,
    transform: [{ rotateZ: '15deg' }],
  },
  
  floatingElement2: {
    position: 'absolute',
    top: '38%',
    right: '7%',
    fontSize: 14,
    color: 'rgba(255, 99, 71, 0.6)',
    textShadowColor: '#FF6347',
    textShadowRadius: 12,
    transform: [{ rotateZ: '-20deg' }],
  },
  
  innerFrame: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    backgroundColor: 'transparent',
  },
  
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 15,
  },
});
export default RegistroScreen;