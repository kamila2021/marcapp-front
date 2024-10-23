import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StudentHome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Hola Estudiante!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default StudentHome;
