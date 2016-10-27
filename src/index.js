import io from 'socket.io-client';
import { Observable } from 'rxjs';
import observableIO from './observableIO';

const socket = io();

const logElem = document.getElementById('log');
const btnElem = document.getElementById('btn-up');

let activeUser;


function writeLog(msg) {
  const msgElem = document.createElement('li');
  msgElem.innerText = msg;
  msgElem.id = Date.now();
  logElem.appendChild(msgElem);
}

const connectionStream = observableIO(socket, 'new connection');
connectionStream.subscribe(
  (action) => {
    if (!activeUser) activeUser = action.user;
    writeLog(`new connection: ${action.user}`);
  }
);
// socket.on('new connection', (action) => {
//   if (!activeUser) activeUser = action.user;
//   writeLog(`new connection: ${action.user}`);
// });

const actionStream = observableIO(socket, 'action');
actionStream.subscribe(
  (action) => {
    writeLog(`button clicked by ${action.user}`);
  }
);
// socket.on('action', (action) => {
//   writeLog(`button clicked by ${action.user}`);
// });

const btnStream = Observable.fromEvent(btnElem, 'click');
btnStream.subscribe((e) => {
  e.preventDefault();
  socket.emit('action', {
    user: activeUser,
    type: 'MOVE_UP',
  });
});
// btnElem.addEventListener('click', (e) => {
//   e.preventDefault();
//   socket.emit('action', {
//     user: activeUser,
//     type: 'MOVE_UP',
//   });
// });
