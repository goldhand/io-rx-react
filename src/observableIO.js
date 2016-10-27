import { Observable } from 'rxjs';

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

export default observableIO;
