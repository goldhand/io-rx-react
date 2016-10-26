import path from 'path';
import express from 'express';
import { Server } from 'http';
import socketIO from 'socket.io';
import { Observable } from 'rxjs';

const app = express();
const server = new Server(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;
const { log } = console;


const observableIO = (socket, event) => Observable.create(
    (observer) => {
      socket.on(event, (data) => {
        observer.next(data);
      });
      return {
        dispose: socket.close,
      };
    }
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let user = 0;
io.on('connection', (socket) => {
  user += 1;
  io.emit('new connection', { user });

  const clickStream = observableIO(socket, 'btn click');

  clickStream.subscribe(
    (action) => { io.emit('btn click', action); },
    (err) => { log(err); },
    () => { log('done'); },
  );
});

server.listen(port, () => {
  log(`listening on *${port}`);
});
