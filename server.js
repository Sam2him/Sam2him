const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Enable CORS for communication between frontend and backend
app.use(cors());

// Serve a test route
app.get('/', (req, res) => {
    res.send('WebRTC Signaling Server is running!');
});

// Socket.IO for WebRTC signaling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins a room
    socket.on('join-room', (roomId, userId) => {
        console.log(`${userId} joined room: ${roomId}`);
        socket.join(roomId);

        // Notify other users in the room
        socket.to(roomId).emit('user-connected', userId);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`${userId} disconnected from room: ${roomId}`);
            socket.to(roomId).emit('user-disconnected', userId);
        });

        // Handle WebRTC ICE candidates
        socket.on('ice-candidate', (userId, candidate) => {
            socket.to(roomId).emit('ice-candidate', userId, candidate);
        });

        // Handle WebRTC Offers
        socket.on('offer', (userId, offer) => {
            socket.to(roomId).emit('offer', userId, offer);
        });

        // Handle WebRTC Answers
        socket.on('answer', (userId, answer) => {
            socket.to(roomId).emit('answer', userId, answer);
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
