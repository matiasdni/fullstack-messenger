import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send-message', (message) => {
    io.emit('receive-message', message);
    console.log('Message received:', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id); 
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
