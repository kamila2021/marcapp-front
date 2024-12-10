import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from '@env';


// Cambia 'http://192.168.1.86:3000' a la dirección correcta de tu backend.

const socket = io('http://192.168.1.94:3000', { transports: ['websocket'] });
console.log('Socket:', socket.connected);

export const joinRoom = (room: string) => {
  socket.emit('joinRoom', { room });
};

export const leaveRoom = (room: string) => {
  socket.emit('leaveRoom', { room });
};

export const sendMessage = (message: string, room: string, sender: string) => {
  socket.emit('sendMessage', {
    event: 'sendMessage',
    data: { content: message, sender, room },
  });
};

export const fetchMessages = (room: string, callback: (messages: any[]) => any) => {
  socket.emit('getMessages', { room });
  socket.on('receiveMessages', callback);
};

export const fetchRooms = (callback: (rooms: string[]) => any) => {
  socket.emit('getAllRooms');
  socket.on('allRooms', callback);
};

export default socket;