import React, { useEffect, useRef, useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, ImageBackground, Animated, Image
} from 'react-native';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAndRotate = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulseAndRotate.start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],  // ligero balanceo para mayor dinamismo
  });

  const handleFakeLogin = () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('¡Inicio de sesión simulado con éxito!');
      // Aquí podrías navegar al juego, por ejemplo:
      // navigation.replace('Game', { username: email });
    }, 2000);
  };

  return (
    <ImageBackground
      // source={require('../assets/imagenes/fondo.jpg')} // fondo tipo cielo azul con nubes
      style={styles.img}
      imageStyle={{ opacity: 0.9 }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>¡Bienvenido a Flappy Bart!</Text>

          <Animated.View
            style={[
              styles.animatedContainer,
              { transform: [{ perspective: 1000 }, { rotateZ: spin }, { scale: scaleAnim }] }
            ]}
          >
            <Image
              source={require('../assets/imagenes/logo.png')} 
              style={styles.image}
            />
          </Animated.View>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleFakeLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Restablecer')}
            disabled={loading}
          >
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  img: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(25, 120, 230, 0.85)', // azul vibrante semitransparente
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
    borderColor: '#ffc107', // dorado brillante
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
    color: '#ff9800', // naranja vibrante
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
    marginBottom: 30,
    shadowColor: '#ffcc00',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 30,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#fffde7',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
    borderWidth: 2,
    borderColor: '#ffb300',
    shadowColor: '#ffb300',
    shadowOpacity: 0.6,
    shadowRadius: 12,
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
  buttonDisabled: {
    backgroundColor: '#cc8a00',
  },
  buttonText: {
    color: '#4a2700',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#fff3e0',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  link: {
    color: '#20272F',
    marginTop: 18,
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
    textAlign: 'center',
    textShadowColor: '#20272F',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  error: {
    color: '#ff3d00',
    marginBottom: 15,
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 16,
  },
});
