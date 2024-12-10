import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serviceAxiosApi } from '../../services/serviceAxiosApi';

const StudentGrades = ({ studentId }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [errorSubjects, setErrorSubjects] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [grades, setGrades] = useState([]);
    const [loadingGrades, setLoadingGrades] = useState(true);
    const [errorGrades, setErrorGrades] = useState(null);

    const calculateAverageGrade = () => {
        if (grades.length === 0) return 0;
        const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
        return total / grades.length;
      };

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const studentData = await serviceAxiosApi.get(`/student/${token}`);
                console.log('studentData',studentData.data);
                if (studentData) {
                    setStudent(studentData.data);
                    await fetchSubjects(studentData.data.id);
                } else {
                    setError('Estudiante no encontrado');
                }
            } catch (err) {
                console.error(err);
                setError('Error al obtener el estudiante');
            } finally {
                setLoading(false);
            }
        };

        const fetchSubjects = async (idStudent) => {
            try {
                setLoadingSubjects(true);
                const response = await serviceAxiosApi.get(`/subject/subjects/${idStudent.toString()}`);
                console.log('MATERIAS DE USUARIO CON ID',idStudent ," ======>> ",response.data);
                setSubjects(response.data);
            } catch (err) {
                console.error(err);
                setErrorSubjects('Error al obtener las materias');
            } finally {
                setLoadingSubjects(false);
            }
        };

        fetchStudent();
    }, [studentId]);

    const handleSubjectChange = async (itemValue) => {
        try {
            setGrades([]);
            setSelectedSubject(itemValue);
        if (itemValue) {
            setLoadingGrades(true);
            const response = await serviceAxiosApi.get(`/student/${student.id}/grades/${itemValue}`);
            setGrades(response.data);
            console.log('response',grades);
            console.log('Buscando notas de materia', itemValue);
            console.log('Buscando notas de estudiante', student.id);

        }
        }
        catch (err) {
            console.error(err);
            setErrorGrades('Error al obtener las notas de la materia');
            alert('no existen notas para esta materia');
        } finally {
            setLoadingGrades(false);
        }
        
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        Alert.alert('Error', error);
        return null;
    }

    if (loadingSubjects) {
        return <ActivityIndicator size="large" color="#00ff00" />;
    }

    if (errorSubjects) {
        Alert.alert('Error', errorSubjects);
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Información.</Text>
            <View style={styles.studentInfo}>
                <Text style={styles.studentText}>Nombre: {student.name}</Text>
                <Text style={styles.studentText}>Nivel: {student.level}</Text>
                <Text style={styles.studentText}>Email: {student.email}</Text>
            </View>

            <Text style={styles.title}>Selecciona una Materia</Text>
            {subjects.length > 0 ? (
                <Picker
                    selectedValue={selectedSubject}
                    onValueChange={handleSubjectChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecciona una materia" value="" />
                    {subjects.map((subject) => (
                        <Picker.Item key={subject.id_subject} label={subject.name} value={subject.id_subject} />
                    ))}
                </Picker>
            ) : (
                <Text style={styles.errorText}>No hay materias para este nivel.</Text>
            )}

{grades.length > 0 && (
        <View style={styles.gradesContainer}>
          <Text style={styles.title}>Notas</Text>
          <FlatList
            data={grades}
            renderItem={({ item }) => (
              <View style={styles.gradeItem}>
                <Text
                  style={[
                    styles.gradeText,
                    { color: item.grade < 4 ? 'red' : 'blue' } // Set color based on grade
                  ]}
                >
                  Nota: {item.grade}
                </Text>
                <Text>Fecha: {item.year}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id ? item.id.toString() : `${item.grade}-${item.date}`} // Handle undefined id
          />
          <Text style={styles.averageText}>
            Promedio: {calculateAverageGrade().toFixed(2)}
          </Text>
        </View>
      )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    studentInfo: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    studentText: {
        fontSize: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    gradesContainer: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
      },
      gradeItem: {
        marginBottom: 10,
      },
      gradeText: {
        fontSize: 18,
      },
      averageText: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
      },
});

export default StudentGrades;
