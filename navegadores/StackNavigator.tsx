import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TablaPuntuacion from '../screens/TablaPuntuacion';
import PerfilUsuario from '../screens/PerfilUsuario';

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator();
function MyDrawer(){
    return(
        <Drawer.Navigator initialRouteName='PerfilUsuario'>
            <Drawer.Screen name="TablaPuntuacion" component={TablaPuntuacion} />
            <Drawer.Screen name="PerfilUsuario" component={PerfilUsuario} />
        </Drawer.Navigator>
    )
}

export default function Navegador() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome"screenOptions={{ headerShown: false,}}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name='Drawer' component={MyDrawer}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


