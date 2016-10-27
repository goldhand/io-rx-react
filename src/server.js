import express from 'express';
import { Server } from 'http';
import SocketIO from 'socket.io';
import webpack from 'webpack';
import webpackConfig from '../webpack.config';

import streams from './streams';

const app = express();
const server = new Server(app);
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const { log } = console;
const compiler = webpack(webpackConfig);


app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <button id="btn-up">^</button>
  <ul id="log"></ul>
  <script src="/dist/main.js"></script>
</body>
</html>
  `);
});

server.listen(port, () => {
  log(`listening on *${port}`);
});

streams(io);
