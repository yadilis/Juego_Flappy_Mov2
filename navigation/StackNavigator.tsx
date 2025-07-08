import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../auth/LoginScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TablaPuntuacion from '../screens/TablaPuntuacion';
import PerfilUsuario from '../screens/PerfilUsuario';
import GameStartScreen from '../screens/GameScreen';
import RegistroScreen from '../auth/RegistroScreen';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props:any) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
   
      <View style={styles.drawerHeader}>
        <Image 
          source={{
            uri: 'https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=204,height=204,fit=cover,f=auto/5e0df231478aa0a331a4718d09dd91a2.png'
          }}
          style={styles.drawerBird}
        />
        <Text style={styles.drawerTitle}>🐦 Flappy Dart</Text>
        <Text style={styles.drawerSubtitle}>¡Vuela alto!</Text>
      </View>
      
   
      <View style={styles.divider} />
      
    
      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>
      
    
      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>✨ ¡Que tengas un buen vuelo! ✨</Text>
      </View>
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator 
      initialRouteName="Game"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
       
        headerStyle: {
          backgroundColor: '#4CAF50',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          letterSpacing: 1,
        },
        headerTitleAlign: 'center',
        
        // Estilos del drawer
        drawerStyle: {
          backgroundColor: '#87CEEB',
          width: 280,
        },
        drawerActiveTintColor: '#FFD700',
        drawerInactiveTintColor: '#fff',
        drawerActiveBackgroundColor: 'rgba(255, 215, 0, 0.2)',
        drawerInactiveBackgroundColor: 'transparent',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          marginLeft: -16,
        },
        drawerItemStyle: {
          borderRadius: 12,
          marginVertical: 4,
          marginHorizontal: 12,
          paddingVertical: 8,
        },
      }}
    >
      <Drawer.Screen 
        name="Game" 
        component={GameStartScreen}
        options={{
          title: '🎮 Juego',
          drawerIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color: focused ? '#FFD700' : '#fff' }}>🎮</Text>
          ),
        }}
      />
      
      <Drawer.Screen 
        name="TablaPuntuacion" 
        component={TablaPuntuacion}
        options={{
          title: '🏆 Puntuaciones',
          drawerIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color: focused ? '#FFD700' : '#fff' }}>🏆</Text>
          ),
        }}
      />
      
      <Drawer.Screen 
        name="PerfirUsuario" 
        component={PerfilUsuario}
        options={{
          title: '👤 Mi Perfil',
          drawerIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color: focused ? '#FFD700' : '#fff' }}>👤</Text>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator();

export default function Navegador() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome" 
        screenOptions={{ 
          headerShown: false,
        
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{
            title: '🌟 Bienvenido',
          }}
        />
        
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            title: '🔐 Iniciar Sesión',
          }}
        />
        
        <Stack.Screen 
          name="Registro" 
          component={RegistroScreen}
          options={{
            title: '📝 Registro',
          }}
        />
        
        <Stack.Screen 
          name="Drawer" 
          component={MyDrawer}
          options={{
            title: '🎮 Flappy Dart',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
  drawerContainer: {
    flex: 1,
    backgroundColor: '#87CEEB', 
  },
  
  drawerHeader: {
    backgroundColor: '#4CAF50',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  drawerBird: {
    width: 80,
    height: 80,
    marginBottom: 15,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFD700', 
  },
  
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700', 
    marginBottom: 5,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  drawerSubtitle: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  
  divider: {
    height: 2,
    backgroundColor: '#FFD700',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 1,
  },
  
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  
  drawerFooter: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)', 
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});