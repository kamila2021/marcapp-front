import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import socket, { joinChat, sendMessage } from '../../services/socketService';

const ChatWithProfessor = ({ route }) => {
  const { userId, receiverId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Unirse al chat usando el userId
    joinChat(userId);

    // Configurar el evento de recepción de mensajes
    socket.on('receiveMessage', (data) => {
      const { message, senderId } = data;
      setMessages((prevMessages) => [...prevMessages, { message, senderId }]);
    });

    // Limpieza del evento al desmontar el componente
    return () => {
      socket.off('receiveMessage');
    };
  }, [userId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Enviar mensaje y actualizar el estado local
      sendMessage(message, userId, receiverId);
      setMessages((prevMessages) => [...prevMessages, { message, senderId: userId }]);
      setMessage(''); // Limpiar el campo de entrada
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={{ color: item.senderId === userId ? 'blue' : 'green' }}>
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
  );
};

export default ChatWithProfessor;
