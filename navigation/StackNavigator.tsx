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


const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Game">
      <Drawer.Screen name="TablaPuntuacion" component={TablaPuntuacion} />
      <Drawer.Screen name="PerfirUsuario" component={PerfilUsuario} />
         <Drawer.Screen name="Game" component={GameStartScreen} />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator();  

export default function Navegador() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />

        <Stack.Screen name="Drawer" component={MyDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}