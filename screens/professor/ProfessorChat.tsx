import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket, { joinRoom, leaveRoom, fetchMessages, sendMessage, fetchRooms } from '../../services/socketService';
import { serviceAxiosApi } from '../../services/serviceAxiosApi';

const ProfessorChat = () => {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState(undefined);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(undefined);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [professor, setProfessor] = useState(undefined);

  // Fetch subjects and students
  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw new Error('No se encontró el token del profesor en AsyncStorage.');
        const response = await serviceAxiosApi.get(`/professor/${token}`);
        setProfessor(response.data);
      } catch (error) {
        console.error('Error al obtener el profesor:', error);
      }
    }

    const fetchSubjects = async () => {
      try {
        const professorId = await AsyncStorage.getItem('id');
        if (!professorId) throw new Error('No se encontró el ID del profesor en AsyncStorage.');
        const response = await serviceAxiosApi.get(`/subject`);
        const filteredSubjects = response.data.filter(
          (subject) => subject.professor?.id == professorId
        );
        setSubjects(filteredSubjects);
      } catch (error) {
        console.error('Error al obtener las materias:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await serviceAxiosApi.get(`/student`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
      }
    };

    const fetchrooms = async () => {
      fetchRooms((fetchedRooms) => {
        setRooms(fetchedRooms);
      });
    };

    fetchProfessor();
    fetchrooms();
    fetchSubjects();
    fetchStudents();
    console.log('Students:', students);
    console.log('Professor:', professor);
    console.log('Rooms:', rooms);
    console.log('Subjects:', subjects);
  }, []);


  useEffect(() => {
    if (room) {
      joinRoom(room);

      fetchMessages(room, (fetchedMessages) => {
        const normalizedMessages = fetchedMessages.map((msg) => ({
          message: msg.content,
          senderId: msg.sender,
          createdAt: msg.createdAt,
        }));
        setMessages(normalizedMessages);
      });

      socket.on('newMessage', (newMessage) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: newMessage.content,
            senderId: newMessage.sender,
            createdAt: newMessage.createdAt,
          },
        ]);
      });

      return () => {
        leaveRoom(room);
        socket.off('newMessage');
      };
    }
  }, [room]);

const handleSubjectChange = (itemValue) => {
  const selectedSubject = subjects.find((subj) => subj.id_subject == itemValue);
  if (selectedSubject) {
    setSubject(selectedSubject);

    // Filtrar las rooms por el profesor y la materia seleccionada
    const filtered = rooms.filter((room) => {
      const [childId, professorId, subjectId] = room.split('-');
      return (
        professorId == professor.id &&  // Coincide el ID del profesor
        subjectId == selectedSubject.id_subject // Coincide el ID de la materia
      );
    });
    console.log('Filtered rooms:', filtered);


    setFilteredRooms(filtered);
  }
};

  const handleRoomChange = (itemValue) => {
    console.log('Room:', itemValue);
    let sala = itemValue.split('-');
    setRoom(`${sala[0]}-${sala[1]}-${sala[2]}`); // Define the room based on student ID
  };

  const handleSendMessage = () => {
    if (message.trim() && room) {
      sendMessage(message, room,professor.id);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione una materia para ver estudiantes:</Text>
      <Picker
        selectedValue={subject?.id_subject}
        onValueChange={handleSubjectChange}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una materia" value={undefined} />
        {subjects.map((subject) => (
          <Picker.Item
            key={subject.id_subject}
            label={`${subject.name} - Nivel ${subject.level}`}
            value={subject.id_subject}
          />
        ))}
      </Picker>

      <Text style={styles.title}>Seleccione un chat disponible:</Text>
      <Picker
        selectedValue={filteredRooms}
        onValueChange={handleRoomChange}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un chat" value={undefined} />
        {filteredRooms.map((room) => (
          <Picker.Item
            key={room}
            label={students.find((student) => student.id_student == room.split('-')[0])?.name}
            value={room}
          />
        ))}
      </Picker>

      <Text style={styles.title}>Mensajes:</Text>
      <FlatList
  data={messages}
  renderItem={({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId == professor?.id ? styles.messageSent : styles.messageReceived,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: '#000' },
        ]}
      >
        {item.message}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  )}
  keyExtractor={(item, index) => index.toString()}
/>

      <TextInput
        style={styles.input}
        placeholder="Escribe un mensaje..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Enviar mensaje" onPress={handleSendMessage} disabled={!room || !message.trim()} />
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
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  message: {
    padding: 5,
    marginVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  messageSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7ff',
    borderBottomRightRadius: 0,
  },
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#d4f9d4',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 5,
    color: '#888',
  },
});

export default ProfessorChat;
