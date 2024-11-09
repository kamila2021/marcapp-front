import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/HomeStyles";
import { serviceAxiosApi } from "../../services/serviceAxiosApi";

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

const ParentHome = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    const access_Token = await AsyncStorage.getItem("accessToken");

    if (!access_Token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await serviceAxiosApi.get(`parent/${access_Token}`);
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
      {/* Saludo en la parte superior */}
      <Text style={styles.title}>{user?.name ? `Hola ${user.name} !` : "Mi perfil!"}</Text>
      
      {/* Contenedor para los botones adicionales */}
      <View style={styles.verticalButtonContainer}>
        {/* Botón Contabilidad */}
        <TouchableOpacity onPress={handleAccountingAlert} style={styles.editButton}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>Contabilidad</Text>
        </TouchableOpacity>

        {/* Botón Calificaciones Pupilo */}
        <TouchableOpacity onPress={() => navigation.navigate("ParentGrades")} style={styles.editButton}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>Calificaciones Pupilo(s)</Text>
        </TouchableOpacity>

        {/* Botón Asistencia */}
        <TouchableOpacity onPress={() => navigation.navigate("ParentAttendance")} style={styles.editButton}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>Asistencia Pupilo(s)</Text>
        </TouchableOpacity>

        {/* Botón Horario */}
        <TouchableOpacity onPress={() => navigation.navigate("ParentHorario")} style={styles.editButton}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>Horario Pupilo(s)</Text>
        </TouchableOpacity>

        {/* Botón Chat */}
        <TouchableOpacity 
          onPress={() => navigation.navigate("ParentChildrenList", { userId: user?.accessToken })} 
          style={styles.editButton}
        >
          <Text style={{ fontSize: 16, color: COLORS.white }}>Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Contenedor para los botones en la parte inferior */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleReload} style={styles.simpleButton}>
          <Text style={{ fontSize: 16, color: COLORS.primary }}>Recargar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.simpleButton}>
          <Text style={{ fontSize: 16, color: COLORS.primary }}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ParentHome;
