import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { serviceAxiosApi } from "../../services/serviceAxiosApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';  

const ParentAttendance = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(undefined);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(undefined);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      console.log("Pupilo seleccionado ID:", selectedStudentId);
      fetchSubjects(selectedStudentId);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId && selectedSubjectId) {
      fetchAttendance();
    }
  }, [selectedSubjectId]);

  const fetchStudents = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("Error", "No se encontró el token.");
      return;
    }

    try {
      const response = await serviceAxiosApi.get(`/parent/get-students/${token}`);
      setStudents(response.data);
      console.log("Estudiantes obtenidos:", response.data);
      if (response.data.length === 0) {
        Alert.alert("Error", "No tiene pupilos asignados.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      Alert.alert("Error", "No se pudo cargar la lista de pupilos.");
    }
  };

  const fetchSubjects = async (selectedStudentId) => {
    
    try {
      const response = await serviceAxiosApi.get(`/subject/subjects/${selectedStudentId}`);
      console.log("Materias obtenidas:", response.data);
      setSubjects(response.data);
      if (response.data.length === 0) {
        Alert.alert("Error", "No hay materias disponibles para el nivel del pupilo.");
      }
    } catch (error) {
      Alert.alert("Error", "No hay materias disponibles para el pupilo.");
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await serviceAxiosApi.get(`/attendance`);
      const filteredAttendance = response.data.filter((record) => record.id_subject == selectedSubjectId);
      setAttendanceRecords(filteredAttendance);
      console.log("Registros de asistencia filtrados:", filteredAttendance);
      if (filteredAttendance.length === 0) {
        Alert.alert("Error", "No hay registros de asistencia para la materia seleccionada.");
      }

      const totalClasses = filteredAttendance.length;
      const presentCount = filteredAttendance.filter((record) =>
        isStudentPresent(record.students, selectedStudentId)
      ).length;
      const percentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      setAttendancePercentage(percentage);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      Alert.alert("Error", "No se pudo cargar los registros de asistencia.");
    }
  };

  const handleStudentChange = (itemValue: number) => {
    setSelectedStudentId(itemValue);
    setSelectedStudentName(students.find((student) => student.id === itemValue)?.name || "");
    setSelectedSubjectId(undefined);
    setAttendanceRecords([]);
    setAttendancePercentage(0);
  };

  const handleSubjectChange = (itemValue: number) => {
    setSelectedSubjectId(itemValue);
    console.log("Materia seleccionada ID:", itemValue);
  };

  const isStudentPresent = (students: number[], studentId: number) => {
    return students.includes(studentId);
  };

  const handleJustification = () => {
    Alert.alert("En desarrollo", "La funcionalidad de justificación está en desarrollo.");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona un Pupilo</Text>
      <Picker selectedValue={selectedStudentId} onValueChange={handleStudentChange} style={styles.picker}>
        <Picker.Item label="Seleccione un pupilo" value={undefined} />
        {students.map((student) => (
          <Picker.Item key={student.id} label={`${student.name} (Nivel ${student.level})`} value={student.id} />
        ))}
      </Picker>

      {subjects.length > 0 && (
        <>
          <Text style={styles.title}>Selecciona una Materia</Text>
          <Picker selectedValue={selectedSubjectId} onValueChange={handleSubjectChange} style={styles.picker}>
            <Picker.Item label="Seleccione una materia" value={undefined} />
            {subjects.map((subject) => (
              <Picker.Item key={subject.id_subject} label={`${subject.name}`} value={subject.id_subject} />
            ))}
          </Picker>
        </>
      )}

      {attendanceRecords.length > 0 && (
        <View style={styles.attendanceContainer}>
          <Text style={styles.attendanceTitle}>Asistencia de {selectedStudentName}</Text>
          <Text style={styles.percentageText}>Porcentaje de asistencia: {attendancePercentage.toFixed(2)}%</Text>

          {attendanceRecords.map((record) => {
            const studentPresent = isStudentPresent(record.students, selectedStudentId);
            return (
              <View key={record._id} style={styles.recordContainer}>
                <Text
                  style={[styles.dateText, { color: studentPresent ? "green" : "red" }]}
                >
                  {formatDate(record.date)} - {studentPresent ? "Presente" : "Ausente"}
                </Text>

                {!studentPresent && (
                  <Icon
                  name="pencil" 
                  size={15} 
                  color="blue" 
                  onPress={handleJustification} 

                  />
                )}
              </View>
            );
          })}
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
  attendanceContainer: {
    marginTop: 20,
  },
  attendanceTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  percentageText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#333",
  },
  recordContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default ParentAttendance;
