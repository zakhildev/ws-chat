const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('static'));

const clients = new Map();

io.on('connection', (socket) => {
  console.log(`New socket connected! (${socket.id})`);

  socket.on('sendMsg', (message) => {
    io.emit('message', message);
  });

  socket.on('join', (message) => {
    clients.set(socket.id, message.name);
    io.emit('userJoin', { name: message.name });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected! (${socket.id})`);
    const clientName = clients.get(socket.id);
    clients.delete(socket.id);
    io.emit('userLeave', { name: clientName });
  });
});

httpServer.listen(3000, () => {
  console.log('Listening on 3000');
});