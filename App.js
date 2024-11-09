import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './screens/Login';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';
import ChatWithProfessor from './screens/chat/ChatWithProfessor'; // Pantalla de chat
import ParentChildrenList from './screens/parent/ParentChildrenList'; // Nueva pantalla para lista de hijos
import ChildProfessorsList from './screens/parent/ChildProfessorsList'; // Nueva pantalla para lista de profesores

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ParentChildrenList"
          component={ParentChildrenList}
          options={{ title: 'Hijos', headerShown: true }}
        />
        <Stack.Screen
          name="ChildProfessorsList"
          component={ChildProfessorsList}
          options={{ title: 'Profesores', headerShown: true }}
        />
        <Stack.Screen
          name="ChatWithProfessor"
          component={ChatWithProfessor}
          options={{ title: 'Chat con Profesor', headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
