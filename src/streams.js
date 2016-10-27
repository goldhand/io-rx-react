import observableIO from './observableIO';

const { log } = console;

export default (io) => {
  let user = 0;
  io.on('connection', (socket) => {
    user += 1;
    io.emit('new connection', { user });

    const actionStream = observableIO(socket, 'action');

    actionStream.subscribe(
      (action) => { io.emit('action', action); },
      (err) => { log(err); },
      () => { log('done'); },
    );
  });
};
