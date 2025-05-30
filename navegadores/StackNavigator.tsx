import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TablaPuntuacion from '../screens/TablaPuntuacion';
import PerfirUsuario from '../screens/PerfirUsuario';
const Drawer = createDrawerNavigator()
function MyDrawer(){
    return(
        <Drawer.Navigator initialRouteName='PerfirUsuario'>
            <Drawer.Screen name="TablaPuntuacion" component={TablaPuntuacion} />
            <Drawer.Screen name="PerfirUsuario" component={PerfirUsuario} />
        </Drawer.Navigator>
    )
}


export type RootStackParamList = {Welcome: undefined;Login: undefined;Game: undefined;Instructions: undefined; Drawer:undefined;};
const Stack = createStackNavigator<RootStackParamList>();
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


