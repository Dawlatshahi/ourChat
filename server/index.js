import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import AuthRoutes from './routes/AuthRoutes.js';
import MessageRoutes from './routes/MessageRoutes.js';
import {
	clientDecrypt,
	clientEncrypt,
	serverDecrypt,
	serverEncrypt,
} from './services/encryption.service.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads/recordings', express.static('uploads/recordings'));
app.use('/uploads/images/', express.static('uploads/images'));

app.use('/api/auth/', AuthRoutes);
app.use('/api/messages', MessageRoutes);

const server = app.listen(process.env.PORT, () => {
	console.log(`server started on port ${process.env.PORT}`);
});

const io = new Server(server, {
	cors: {
		origin: '*',
		credentials: true,
	},
});

global.onlineUsers = new Map();
io.on('connection', (socket) => {
	global.chatSocket = socket;

	socket.on('add-user', (userId) => {
		onlineUsers.set(userId, socket.id);
		socket.broadcast.emit('online-users', {
			onlineUsers: Array.from(onlineUsers.keys()),
		});
	});

	socket.on('signout', (id) => {
		onlineUsers.delete(id);
		socket.broadcast.emit('online-users', {
			onlineUsers: Array.from(onlineUsers.keys()),
		});
	});

	// Handle user disconnect
	socket.on('disconnect', () => {
		for (const [userId, socketId] of onlineUsers.entries()) {
			if (socketId === socket.id) {
				onlineUsers.delete(userId);
				break;
			}
		}
		socket.broadcast.emit('online-users', {
			onlineUsers: Array.from(onlineUsers.keys()),
		});
	});

	socket.on('outgoing-voice-call', (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('incoming-voice-call', {
				from: data.from,
				roomId: data.roomId,
				callType: data.callType,
			});
		} else {
			const senderSocket = onlineUsers.get(data.from);
			socket.to(senderSocket).emit('voice-call-offline');
		}
	});

	socket.on('reject-voice-call', (data) => {
		const sendUserSocket = onlineUsers.get(data.from);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('voice-call-rejected');
		}
	});

	socket.on('outgoing-video-call', (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('incoming-video-call', {
				from: data.from,
				roomId: data.roomId,
				callType: data.callType,
			});
		} else {
			const senderSocket = onlineUsers.get(data.from);
			socket.to(senderSocket).emit('video-call-offline');
		}
	});

	socket.on('accept-incoming-call', ({ id }) => {
		const sendUserSocket = onlineUsers.get(id);
		socket.to(sendUserSocket).emit('accept-call');
	});

	socket.on('reject-video-call', (data) => {
		const sendUserSocket = onlineUsers.get(data.from);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('video-call-rejected');
		}
	});

	socket.on('send-msg', (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (data.message.type == 'text')
			data.message.message = clientEncrypt(serverDecrypt(data.message.message));
		if (sendUserSocket) {
			socket
				.to(sendUserSocket)
				.emit('msg-recieve', { from: data.from, message: data.message });
		}
	});

	socket.on('mark-read', ({ id, recieverId }) => {
		const sendUserSocket = onlineUsers.get(id);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('mark-read-recieve', { id, recieverId });
		}
	});
});
