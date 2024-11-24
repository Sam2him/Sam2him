// Signaling server ka code (server.js)
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Public folder static files serve karega
app.use(express.static("public")); // HTML client code yahan hoga

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room: ${roomId}`);
    });

    socket.on("signal", (data) => {
        io.to(data.roomId).emit("signal", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
