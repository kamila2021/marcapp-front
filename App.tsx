import React from 'react';
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
const Stack = createNativeStackNavigator();

export default function App() {
 
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}