import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serviceAxiosApi } from '../../services/serviceAxiosApi';

const StudentHorario = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [errorSubjects, setErrorSubjects] = useState(null);
    const [studentLevel, setStudentLevel] = useState('');

    // Días de la semana y orden de bloques
    const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    const blocksOrder = ['A', 'B', 'C', 'D', 'E'];

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const response = await serviceAxiosApi.get('/student');
                const studentData = response.data.find(student => student.access_token === token);
                if (studentData) {
                    setStudent(studentData);
                    setStudentLevel(studentData.level);
                    await fetchSubjects(studentData.level);
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

        const fetchSubjects = async (level) => {
            try {
                setLoadingSubjects(true);
                const response = await serviceAxiosApi.get('/subject');
                const filteredSubjects = response.data.filter(subject => subject.level === level);
                console.log('Materias:', filteredSubjects);
                setSubjects(filteredSubjects);
            } catch (err) {
                console.error(err);
                setErrorSubjects('Error al obtener las materias');
            } finally {
                setLoadingSubjects(false);
            }
        };

        fetchStudent();
    }, []);

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

    // Organizar materias por día y ordenar por bloque
    const organizedSubjects = daysOfWeek.map(day => {
        const subjectsForDay = subjects
            .filter(subject => subject.day === day)
            .sort((a, b) => blocksOrder.indexOf(a.block) - blocksOrder.indexOf(b.block));
        console.log('Materias para', day, subjectsForDay);
        return { day, subjects: subjectsForDay };
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Horario del Estudiante</Text>

            <View style={styles.studentInfo}>
                <Text style={styles.studentText}>Nombre: {student.name}</Text>
                <Text style={styles.studentText}>Nivel: {student.level}</Text>
                <Text style={styles.studentText}>Email: {student.email}</Text>
            </View>

            <Text style={styles.title}>Horario</Text>
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
    dayContainer: {
        marginBottom: 15,
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subjectContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        borderRadius: 5,
    },
    subjectText: {
        fontSize: 16,
    },
    noSubjectsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
});

export default StudentHorario;
