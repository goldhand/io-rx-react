import path from 'path';
import express from 'express';
import { Server } from 'http';
import socketIO from 'socket.io';

const app = express();
const server = new Server(app);
const io = socketIO(server);
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;
const { log } = console;


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let user = 0;
io.on('connection', (socket) => {
  user += 1;
  io.emit('new connection', { user });

  socket.on('btn click', (action) => {
    io.emit('btn click', action);
  });
});

server.listen(port, host, () => {
  log(`listening on ${host}:${port}`);
});
