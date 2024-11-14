import { io } from 'socket.io-client';

// Cambia '192.168.X.X' por la IP de tu backend o dominio, y asegúrate de que el puerto sea el correcto
const socket = io('http://192.168.X.X:3000', { transports: ['websocket'] });
// Cambia la URL por la IP o dominio de tu backend si es necesario
const socket = io('http://localhost:3000', { transports: ['websocket'] });

export const joinChat = (userId: string) => {
  socket.emit('joinChat', userId);
};

export const sendMessage = (message: string, senderId: string, receiverId: string) => {
  socket.emit('sendMessage', { message, senderId, receiverId });
};

export default socket;
