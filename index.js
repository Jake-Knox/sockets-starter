const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

// run server normally         -> node index.js
// run nodemon updating server -> nodemon ./index.js localhost 3000


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('user connected');
    // socket.broadcast.emit('hi');


    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('join room', (msg) => {
      console.log("new user joining room: " + msg);
      socket.join(msg);
      io.to(msg).emit("user joined", msg);
    });

    socket.on('leave room', (msg) => {
      console.log("user leaving room: " + msg);
      socket.leave(msg);
      io.to(msg).emit("user left");
    });

    socket.on('new colour', (room, hexcode) => {
      // io.emit('chat message', msg);
      console.log("new colour in room: " + room + " - " + hexcode);
      io.to(room).emit("new colour", room, hexcode);
  });

    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
    
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});