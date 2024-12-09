import { Room } from '../models/room.model.js';

export const initSocket = (io) => {
    const roomReadiness = {}; // Track readiness per room

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('message', (data) => {
            console.log(`Received message: ${data.message}`);
        });

        socket.on('userJoined', (data) => {
            console.log(`User joined: ${data.participant}`);

            if (!roomReadiness[data.key]) {
                roomReadiness[data.key] = new Set();
            }
            
            io.emit('userJoined', { participant: data.participant });
        });

        socket.on('userLoggedOut', async (data) => {
            console.log(`User left: ${data.user}`);
            
            try {
                const key = data.key;
                const room = await Room.findOne({ key });
                if (room) {
                    console.log(`Room ${key}'s participants members updated.`);
                    room.participants.remove(data.user);
                    await room.save();
                    io.emit('userLoggedOut', { participant: data.user });
                }
            } catch (err) {
                console.error('Error leaving the room', err);
            }
        });

        socket.on('deleteRoom', async (data) => {
            console.log(`Room deleted: ${data.name}`);
            const name = data.name;
            const key = data.key;

            try {
                const room = await Room.findOneAndDelete({ key });
                if (room) {
                    console.log(`Room ${key} deleted by creator.`);
                    io.emit("refreshRoom", { key: key, name: name }); // Notify all clients to refresh
                }
            } catch (err) {
                console.error(`Error deleting room ${key}:`, err);
            }
        });

        socket.on('ready', async (data) => {
            const key = data.key;
            const user = data.user;

            if (!roomReadiness[key]) {
                roomReadiness[key] = new Set();
            }

            roomReadiness[key].add(user);

            try {
                const room = await Room.findOne({ key });
                if (room) {
                    const totalParticipants = room.participants.length;

                    // The stored players must be the same as the participants + the creator
                    if (roomReadiness[key].size === totalParticipants + 1) {
                        io.emit('allReady', { key });
                    }
                    else {
                        io.emit('notReady', { ready: roomReadiness[key].size });
                    }
                }
            } catch (err) {
                console.error('Error checking room readiness:', err);
            }
        });

        socket.on('startGame', async (data) => {
            console.log('Game started');
            const key = data.key;

            try {
                const room = await Room.findOne({ key });
                if (room) {
                    console.log(`Room ${key}'s status updated to active.`);
                    room.status = 'active';
                    await room.save();
                    io.emit('startGame');
                }
            } catch (err) {
                console.error(`Error deleting room ${key}:`, err);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};
