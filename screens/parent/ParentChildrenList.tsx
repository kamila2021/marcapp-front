import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TextInput, Button, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket, { joinChat, sendMessage } from '../../services/socketService';
import { serviceAxiosApi } from '../../services/serviceAxiosApi';

const ParentChildrenChat = () => {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(undefined);
  const [selectedChildName, setSelectedChildName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(undefined);
  const [loadingProfessors, setLoadingProfessors] = useState(false);
  const [errorProfessors, setErrorProfessors] = useState(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("Fetching children list...");
    const fetchChildren = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No se encontró el token.");
        return;
      }
      try {
        console.log("Sending request to fetch children...");
        const response = await serviceAxiosApi.get(`/parent/get-students/${token}`);
        console.log("Received response:", response.data);
        setChildren(response.data);
        if (response.data.length === 0) {
          Alert.alert("Error", "No tiene hijos asignados.");
        }
      } catch (error) {
        console.error('Error al cargar los hijos:', error);
        Alert.alert("Error", "No se pudo cargar la lista de hijos.");
      }
    };
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId && selectedProfessor) {
      console.log(`Joining chat room for child ID: ${selectedChildId}`);
      joinChat(selectedChildId);
      socket.on('receiveMessage', (data) => {
        console.log("Received message:", data);
        const { message, senderId } = data;
        setMessages((prevMessages) => [...prevMessages, { message, senderId }]);
      });
      return () => {
        console.log("Cleaning up socket event for receiveMessage");
        socket.off('receiveMessage');
      };
    }
  }, [selectedChildId, selectedProfessor]);

  const handleChildChange = (itemValue) => {
    console.log("Child selected:", itemValue);
    const selectedChild = children.find((child) => child.id === itemValue);
    if (selectedChild) {
      console.log(`Selected child details: ID - ${selectedChild.id}, Name - ${selectedChild.name}`);
      setSelectedChildId(selectedChild.id);
      setSelectedChildName(selectedChild.name);
      fetchProfessors(selectedChild.level);
    }
  };

  const fetchProfessors = async (level) => {
    console.log("Fetching professors for level:", level);
    setLoadingProfessors(true);
    setErrorProfessors(null);
    try {
      const response = await serviceAxiosApi.get(`/subject`);
      console.log("Professors response:", response.data);
      const filteredResponse = response.data
        .filter((subject) => subject.level === level)
        .reduce((uniqueProfessors, subject) => {
          const exists = uniqueProfessors.some(
            (item) => item.professor_id === subject.professor_id
          );
          if (!exists) {
            uniqueProfessors.push(subject);
          }
          return uniqueProfessors;
        }, []);
      console.log("Filtered professors list:", filteredResponse);
      setSubjects(filteredResponse);
    } catch (error) {
      console.error("Error fetching professors:", error);
      setErrorProfessors("No se pudo cargar la lista de profesores.");
    } finally {
      setLoadingProfessors(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      sendMessage(message, selectedChildId, selectedProfessor);
      setMessages((prevMessages) => [...prevMessages, { message, senderId: selectedChildId }]);
      setMessage(''); // Limpiar el campo de entrada
    } else {
      console.log("Empty message, not sending.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione un Pupilo para chatear con profesor.</Text>
      <Picker
        selectedValue={selectedChildId}
        onValueChange={handleChildChange}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un Pupilo" value={undefined} />
        {children.map((child) => (
          <Picker.Item key={child.id} label={child.name} value={child.id} />
        ))}
      </Picker>

      {loadingProfessors ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorProfessors ? (
        <Text style={styles.errorText}>{errorProfessors}</Text>
      ) : subjects.length > 0 ? (
        <>
          <Text style={styles.professorListTitle}>Seleccione un profesor</Text>
          <Picker
            selectedValue={selectedProfessor}
            onValueChange={(itemValue) => {
              console.log("Professor selected:", itemValue);
              setSelectedProfessor(itemValue);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un Profesor" value={undefined} />
            {subjects.map((subject) => (
              <Picker.Item
                key={subject.professor_id}
                label={`${subject.professor_name} - ${subject.name}`}
                value={subject.professor_id}
              />
            ))}
          </Picker>
        </>
      ) : (
        <Text style={styles.noProfessorsText}>No se encuentran profesores para chatear.</Text>
      )}

      {selectedProfessor && (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <Text style={{ color: item.senderId === selectedChildId ? 'blue' : 'green' }}>
                {item.message}
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe un mensaje"
            style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
          />
          <Button title="Enviar" onPress={handleSendMessage} />
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
  professorListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  noProfessorsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default ParentChildrenChat;
