import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
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
import {OneSignal} from 'react-native-onesignal';

const Login = ({ navigation }: { navigation: any }) => {
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [userType, setUserType] = useState<"parent" | "student"|"professor">("parent");


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
      const loginUserType = userType;
  
      const loginFetch = await serviceAxiosApi.post(`auth/login`, {
        email: email,
        password: password,
        userType: loginUserType, 
      });
  
      console.log('login fetch data',loginFetch.data);
  
      await AsyncStorage.setItem("accessToken", loginFetch.data.accessToken);
      await AsyncStorage.setItem("refreshToken", loginFetch.data.refreshToken);
      await AsyncStorage.setItem("userType", loginUserType);
      await AsyncStorage.setItem("id", loginFetch.data.id.toString());


        // Save the OneSignal ID in your database
        if (loginUserType === "parent") {
          const patch = await serviceAxiosApi.patch(`parent/${loginFetch.data.id}`, {
            notification_id: "playerId",
          });
          console.log('patch de parent', patch.data);
        }
        else if (loginUserType === "student") {
          const patch = await serviceAxiosApi.patch(`student/${loginFetch.data.id}`, {
            notification_id: "playerId2",
          });
        }
        else if (loginUserType === "professor") {
          const patch = await serviceAxiosApi.patch(`professor/${loginFetch.data.id}`, {
            notification_id: "playerId3",
          });
      }
      setMessage("Inicio de sesión exitoso");
  
      // Navigate based on user type
      if (userType === "parent") {
        console.log('navegando a parent home');
        navigation.navigate("ParentHome");
      } else if (userType === "student") {
        console.log('navegando a student home');
        navigation.navigate("StudentHome");
      } else if (userType === "professor"){
        console.log('navegando a professor home');
        navigation.navigate("ProfessorHome");
      }

    } catch (error) {
      console.error("Error al realizar el inicio de sesión:", error.message);
      Alert.alert(
        "Error",
        "Email o contraseña incorrectos. Por favor, inténtelo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { textAlign: "center" }]}>
              Colegio {"\n"} Bajos del Cerro Chico
            </Text>
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

            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>Tipo de Usuario</Text>
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => setUserType(itemValue)}
                style={{ height: 50, width: "100%" }}
              >
                <Picker.Item label="Apoderado" value="parent" />
                <Picker.Item label="Profesor" value="professor" />
                <Picker.Item label="Estudiante" value="student" />
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
              <Text style={styles.linkButtonText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {loading && (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={styles.loadingIndicator}
              />
            )}

            {message !== "" && (
              <Text style={styles.errorMessage}>{message}</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
