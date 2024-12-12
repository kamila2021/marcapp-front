import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TextInput, Button, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket, { joinRoom, leaveRoom, fetchMessages, sendMessage } from '../../services/socketService';
import { serviceAxiosApi } from '../../services/serviceAxiosApi';

const ParentChildrenChat = () => {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(undefined);
  const [selectedChildName, setSelectedChildName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(undefined);
  const [selectedSubject, setSelectedSubject] = useState(undefined);
  const [loadingProfessors, setLoadingProfessors] = useState(false);
  const [errorProfessors, setErrorProfessors] = useState(null);
  const [room, setRoom] = useState(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchChildren = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No se encontró el token.");
        return;
      }
      try {
        const response = await serviceAxiosApi.get(`/parent/get-students/${token}`);
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
    if (selectedChildId && selectedProfessor && selectedSubject) {
      const newRoom = `${selectedChildId}-${selectedProfessor}-${selectedSubject}`;
      setRoom(newRoom);
    }
  }, [selectedChildId, selectedProfessor, selectedSubject]);

  useEffect(() => {
    if (room) {
      joinRoom(room);
      fetchRoomMessages(room);

      // Limpieza al desmontar o cambiar de sala
      return () => {
        leaveRoom(room);
        socket.off("newMessage");
      };
    }
  }, [room]);

  const fetchRoomMessages = (room) => {
    fetchMessages(room, (fetchedMessages) => {
      const normalizedMessages = fetchedMessages.map((msg) => ({
        message: msg.content,
        senderId: msg.sender,
        createdAt: msg.createdAt,
      }));
      setMessages(normalizedMessages);
    });

    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: newMessage.content,
          senderId: newMessage.sender,
          createdAt: newMessage.createdAt,
        },
      ]);
    });
  };

  const handleChildChange = (itemValue) => {
    const selectedChild = children.find((child) => child.id === itemValue);
    if (selectedChild) {
      setSelectedChildId(selectedChild.id);
      setSelectedChildName(selectedChild.name);
      fetchProfessors(selectedChild.level);
    }
  };

  const fetchProfessors = async (level) => {
    setLoadingProfessors(true);
    setErrorProfessors(null);
    try {
      const response = await serviceAxiosApi.get(`/subject`);
      const filteredResponse = response.data.filter((subject) => subject.level == level);
      setSubjects(filteredResponse);
    } catch (error) {
      setErrorProfessors("No se pudo cargar la lista de profesores.");
    } finally {
      setLoadingProfessors(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && room) {
      sendMessage(message, room, selectedChildId || 'unknown');
      setMessage('');
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
              setSelectedProfessor(itemValue.professor.id);
              setSelectedSubject(itemValue.id_subject);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un Profesor" value={undefined} />
            {subjects.map((subject) => (
              <Picker.Item
                key={subject.professor.id}
                label={`${subject.professor.name} - ${subject.name}`}
                value={subject}
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: item.senderId == selectedChildId ? 'flex-end' : 'flex-start', // Alinea a la derecha o izquierda
            marginVertical: 5,
          }}
        >
          <View
            style={{
              maxWidth: '70%', // Limita el ancho del mensaje
              backgroundColor: item.senderId == selectedChildId ? '#d1e7ff' : '#d4f9d4', // Azul para el remitente, verde para el receptor
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#000' }}>
              {item.message}
            </Text>
            <Text style={{ fontSize: 10, textAlign: 'right', color: '#555' }}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
    <TextInput
      value={message}
      onChangeText={setMessage}
      placeholder="Escribe un mensaje"
      style={{
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
      }}
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
