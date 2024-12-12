import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serviceAxiosApi } from "../../services/serviceAxiosApi";
interface User {
    name: string;
    email: string;
    accessToken: string;
    userType: UserType;
  }

enum UserType {
Admin = "admin",
Professor = "professor",
Parent = "parent",
Student = "student",
}

const NotificationsScreen = ({ navigation }: { navigation: any }) => {
    const [user, setUser] = useState<   User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    const fetchProfile = async () => {
      setLoading(true);
      const access_Token = await AsyncStorage.getItem("accessToken");
      const userType = await AsyncStorage.getItem("userType");
  
      if (!access_Token) {
        setError("No token found");
        setLoading(false);
        return;
      }
  
      try {
        const response = await serviceAxiosApi.get(`${userType}/${access_Token}`);
        console.log('response',response.data);
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

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Notifications Screen</Text>
        </View>
    );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  text: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});

export default NotificationsScreen;
