import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './screens/user/Login';  
import ForgotPassword from './screens/user/ForgotPassword'; 
import ResetPassword from './screens/user/ResetPassword'; // Importa la pantalla de ResetPassword
import Home from './screens/user/Home';
import ProfileEdit  from './screens/user/ProfileEdit';
import  UserDetails  from './screens/user/UserDetails';
import  ParentHome  from './screens/parent/ParentHome';
import AdminHome from './screens/admin/AdminHome';
import StudentHome from './screens/student/StudentHome';
import ProfessorHome from './screens/professor/ProfessorHome';
import AdminStudent from './screens/admin/AdminStudent';
import CreateStudent from './screens/admin/CreateStudent';
import AdminProfessor from './screens/admin/AdminProfessor';
import CreateProfessor from './screens/admin/CreateProfessor';
import AdminParent from './screens/admin/AdminParent';
import CreateParent from './screens/admin/CreateParent';
import AdminSubject from './screens/admin/AdminSubject';
import CreateSubject from './screens/admin/CreateSubject';
import ParentAttendance from './screens/parent/ParentAttendance';
import StudentAttendance from './screens/student/StudentAttendance';
import ParentGrades from './screens/parent/ParentGrades';
import StudentGrades from './screens/student/StudentGrades';
import StudentHorario from './screens/student/StudentHorario';
import ParentHorario from './screens/parent/ParentHorario';
import ParentChildrenList from './screens/parent/ParentChildrenChat';
import ChatWithProfessor from './screens/chat/ChatWithProfessor';
import ProfessorChat from './screens/professor/ProfessorChat';
import TransbankHome from './screens/transbank/TransbankHome';
import NotificationsScreen from './screens/user/Notifications';
import {OneSignal} from 'react-native-onesignal';

const Stack = createNativeStackNavigator();

export default function App() {
   // Remove this method to stop OneSignal Debugging
   //OneSignal.SetLogLevel(OneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG)
   
   // OneSignal Initialization
   OneSignal.initialize("1d4c09bc-73a5-4063-97ee-58a042ecbf21");
 
   // requestPermission will show the native iOS or Android notification permission prompt.
   // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
   OneSignal.Notifications.requestPermission(true);
 
   // Method for listening for notification clicks
   OneSignal.Notifications.addEventListener('click', (event) => {
     console.log('OneSignal: notification clicked:', event);
   });


   
 
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ResetPassword" 
          component={ResetPassword}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ProfileEdit"
          component={ProfileEdit}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ParentHome"
          component={ParentHome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminHome"
          component={AdminHome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="StudentHome"
          component={StudentHome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ProfessorHome"
          component={ProfessorHome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminStudent"
          component={AdminStudent}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CreateStudent"
          component={CreateStudent}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminProfessor"
          component={AdminProfessor}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CreateProfessor"
          component={CreateProfessor}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminParent"
          component={AdminParent}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CreateParent"
          component={CreateParent}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminSubject"
          component={AdminSubject}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CreateSubject"
          component={CreateSubject}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ParentAttendance"
          component={ParentAttendance}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="StudentAttendance"
          component={StudentAttendance}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ParentGrades"
          component={ParentGrades}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="StudentGrades"
          component={StudentGrades}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="StudentHorario"
          component={StudentHorario}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ParentHorario"
          component={ParentHorario}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ParentChildrenList"
          component={ParentChildrenList}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ChatWithProfessor"
          component={ChatWithProfessor}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ProfessorChat"
          component={ProfessorChat}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="TransbankHome"
          component={TransbankHome}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}