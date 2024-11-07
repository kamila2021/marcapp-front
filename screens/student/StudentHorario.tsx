import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serviceAxiosApi } from '../../services/serviceAxiosApi';

const StudentHorario = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [errorSubjects, setErrorSubjects] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [studentLevel, setStudentLevel] = useState('');

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

    const handleLevelChange = (itemValue) => {
        setSelectedLevel(itemValue);
        if (itemValue) {
            Alert.alert('Buscando horario del estudiante');
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

    const filteredSubjects = subjects.filter(subject => subject.level === studentLevel);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Horario del Estudiante</Text>

            <View style={styles.studentInfo}>
                <Text style={styles.studentText}>Nombre: {student.name}</Text>
                <Text style={styles.studentText}>Nivel: {student.level}</Text>
                <Text style={styles.studentText}>Email: {student.email}</Text>
            </View>

            <Text style={styles.title}>Horario</Text>
            {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                    <View key={subject.id_subject} style={styles.subjectContainer}>
                        <Text style={styles.subjectText}>
                            {subject.name} - {subject.day} - {subject.block}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={styles.errorText}>No hay materias para este nivel.</Text>
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
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default StudentHorario;
