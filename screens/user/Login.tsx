import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../../constants/colors";
import Button from "../../components/Button";
import styles from "../../assets/styles/LoginStyles";
import { validateEmail, validatePassword } from "../../utils/validation";
import { Picker } from "@react-native-picker/picker"; 
import { serviceAxiosApi } from "../../services/serviceAxiosApi";

const Login = ({ navigation }: { navigation: any }) => {
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [userType, setUserType] = useState<"parent" | "professor" | "student" | "admin">("parent");

  const handleLogin = async () => {
    console.log(email, password);
    console.log(userType);
  
    if (email === "" || password === "") {
      Alert.alert("Error", "Por favor, complete todos los campos");
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor, ingrese un correo electrónico válido");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert("Error", "Contraseña inválida");
      return;
    }
  
    setLoading(true);
  
    try {
      // If the user selects "admin", authenticate them as "professor"
      const loginUserType = userType === "admin" ? "professor" : userType;
  
      const loginFetch = await serviceAxiosApi.post(`auth/login`, {
        email: email,
        password: password,
        userType: loginUserType, // Send professor type for login when admin is selected
      });
  
      console.log(loginFetch.data);
      const access_token = loginFetch.data.accessToken;
      const refresh_token = loginFetch.data.refreshToken;
  
      await AsyncStorage.setItem("accessToken", access_token);
      await AsyncStorage.setItem("refreshToken", refresh_token);
      await AsyncStorage.setItem("userType", loginUserType); // Save original user type
  
      setMessage("Inicio de sesión exitoso");
  
      // Navigate based on user type
      if (userType === "parent") {
        navigation.navigate("ParentHome");
      } else if (userType === "professor") {
        navigation.navigate("ProfessorHome");
      } else if (userType === "student") {
        navigation.navigate("StudentHome");
      } else if (userType === "admin") {
        // If the user selected admin, navigate to AdminHome
        navigation.navigate("AdminHome");
      }
    } catch (error) {
      console.error("Error al realizar el inicio de sesión:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo más tarde"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Colegio</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.welcomeText}>¡Bienvenido! 👋</Text>
          <Text style={styles.introText}>
            Ingresa tu correo y contraseña para iniciar sesión
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Correo</Text>
          <TextInput
            placeholder="Ingresa tu correo"
            placeholderTextColor={COLORS.black}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isPasswordShown ? "eye-off" : "eye"}
                size={24}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Añadir el Picker para seleccionar el tipo de usuario */}
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Tipo de Usuario</Text>
          <Picker
            selectedValue={userType}
            onValueChange={(itemValue) => setUserType(itemValue)}
            style={{ height: 50, width: '100%' }} 
          >
            <Picker.Item label="Apoderado" value="parent" />
            <Picker.Item label="Profesor" value="professor" />
            <Picker.Item label="Estudiante" value="student" />
            <Picker.Item label="Administración" value="admin" />
          </Picker>
        </View>

        <Button
          title="Iniciar sesión"
          filled
          onPress={handleLogin}
          style={styles.button}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.linkButton}
        >
          <Text style={styles.linkButtonText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loadingIndicator}
          />
        )}

        {message !== "" && <Text style={styles.errorMessage}>{message}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default Login;
