import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/HomeStyles";
import { serviceAxiosApi } from "../../services/serviceAxiosApi";
import Icon from "react-native-vector-icons/MaterialIcons";

enum UserType {
  Admin = "admin",
  Professor = "professor",
  Parent = "parent",
  Student = "student",
}

interface User {
  name: string;
  email: string;
  accessToken: string;
  userType: UserType;
}

const StudentHome = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    const access_Token = await AsyncStorage.getItem("accessToken");
    console.log('access token: obtenido de async storage',access_Token);
    const id = await AsyncStorage.getItem("id");
    console.log('id obtenido de async storage',id);
    if (!access_Token||!id) {
      setError("No token or id found");
      setLoading(false);
      return;
    }

    try {
      const response = await serviceAxiosApi.get(`student/${access_Token}`);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleReload = () => {
    setLoading(true);
    fetchProfile();
  };

  const handleAccountingAlert = () => {
    Alert.alert("Próximamente. en desarrollo", "Esta funcionalidad estará disponible pronto.");
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Ícono de notificaciones en la esquina superior derecha */}
      <TouchableOpacity
        style={{ position: "absolute", top: 10, right: 10 }}
        onPress={() => navigation.navigate("NotificationsScreen")}
      >
        <Icon name="notifications" size={30} color={COLORS.black} />
      </TouchableOpacity>
      {/* Saludo en la parte superior */}
      <Text style={styles.title}>{user?.name ? `Hola ${user.name} !` : "Mi perfil!"}</Text>
      
      {/* Contenedor para los botones adicionales */}
      <View style={styles.verticalButtonContainer}>

        {/* Botón Calificaciones */}
        <TouchableOpacity onPress={() => navigation.navigate("StudentGrades")} style={styles.editButton}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>Calificaciones</Text>
        </TouchableOpacity>

        {/* Botón Asistencia */}
        <TouchableOpacity onPress={() => navigation.navigate("StudentAttendance")} style={styles.editButton}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>Asistencia</Text>
        </TouchableOpacity>

        {/* Botón Horario */}
        <TouchableOpacity onPress={() => navigation.navigate("StudentHorario")} style={styles.editButton}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>Horario</Text>
        </TouchableOpacity>
      </View>

      {/* Contenedor para los botones en la parte inferior */}
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity onPress={handleReload} style={styles.simpleButton}>
          <Text style={{ fontSize: 16, color: COLORS.primary }}>Recargar</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleLogout} style={styles.simpleButton}>
          <Text style={{ fontSize: 16, color: COLORS.primary }}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StudentHome;
