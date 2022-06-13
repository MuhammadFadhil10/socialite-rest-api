import { Server } from 'socket.io';
let io;
export default {
	init: (httpServer) => {
		io = new Server(httpServer, {
			cors: {
				origin: 'http://localhost:3000',
				methods: ['GET', 'POST', 'DELETE'],
			},
		});
		return io;
	},
	getIo: () => {
		if (!io) {
			throw new Error('Socket.io not initialized!');
		}
		return io;
	},
};
