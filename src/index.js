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

const actionStream = observableIO(socket, 'action');
actionStream.subscribe(
  (action) => {
    switch (action.type) {
      case 'CONNECTION':
        if (!activeUser) activeUser = action.user;
        return writeLog(`new connection: ${action.user}`);
      case 'MOVE_UP':
        return writeLog(`button clicked by ${action.user}`);
      default:
        return writeLog(action);
    }
  }
);

const btnStream = Observable.fromEvent(btnElem, 'click');
btnStream.subscribe((e) => {
  e.preventDefault();
  socket.emit('action', {
    user: activeUser,
    type: 'MOVE_UP',
  });
});
