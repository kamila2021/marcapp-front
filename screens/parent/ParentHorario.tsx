import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { serviceAxiosApi } from "../../services/serviceAxiosApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ParentHorario = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(undefined);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [errorSubjects, setErrorSubjects] = useState<string | null>(null);

  const daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
  const blocksOrder = ["A", "B", "C", "D", "E"];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("Error", "No se encontró el token.");
      return;
    }

    try {
      const response = await serviceAxiosApi.get(`/parent/get-students/${token}`);
      setStudents(response.data);
      if (response.data.length === 0) {
        Alert.alert("Error", "No tiene pupilos asignados.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      Alert.alert("Error", "No se pudo cargar la lista de pupilos.");
    }
  };

  const fetchStudentSchedule = async (student: any) => {
    setLoadingSubjects(true);
    setErrorSubjects(null);
    try {
      const response = await serviceAxiosApi.get(`/subject`);
      const filteredSubjects = response.data.filter((subject) => subject.level === student.level);
      setSubjects(filteredSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setErrorSubjects("No se pudo cargar el horario del pupilo.");
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleStudentChange = (student: any) => {
    setSelectedStudentId(student.id_student);
    fetchStudentSchedule(student);
  };

  // Organizar materias por día y ordenar por bloque
  const organizedSubjects = daysOfWeek.map(day => {
    const subjectsForDay = subjects
      .filter(subject => subject.day === day)
      .sort((a, b) => blocksOrder.indexOf(a.block) - blocksOrder.indexOf(b.block));
    return { day, subjects: subjectsForDay };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona un Pupilo para Ver el Horario</Text>
      <Picker
        selectedValue={selectedStudentId}
        onValueChange={(itemValue) => handleStudentChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un pupilo" value={undefined} />
        {students.map((student) => (
          <Picker.Item
            key={student.id_student}
            label={`${student.name} (Nivel ${student.level})`}
            value={student}
          />
        ))}
      </Picker>

      {loadingSubjects ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorSubjects ? (
        <Text style={styles.errorText}>{errorSubjects}</Text>
      ) : (
        <View>
          {organizedSubjects.map(({ day, subjects }) => (
            <View key={day} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>{day}</Text>
              {subjects.length > 0 ? (
                subjects.map(subject => (
                  <View key={subject.id_subject} style={styles.subjectContainer}>
                    <Text style={styles.subjectText}>
                      {subject.name} - Bloque {subject.block}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noSubjectsText}>No hay horario para este día.</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  dayContainer: {
    marginBottom: 15,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subjectContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    borderRadius: 5,
  },
  subjectText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  noSubjectsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ParentHorario;
