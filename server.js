import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import middleware from 'socketio-wildcard';
import qs from 'querystring';
import crypto from 'crypto';
import config from './core/config';
import connectToDb from './db/connect';
import logger from './core/logger';
import routes from './routes';

const cors = require('cors');

const app = express();
app.use(cors());
const server = http.Server(app);
const io = socketio(server);

connectToDb();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

io.use(middleware());

io.on('connection', (socket) => {
  socket.emit('hello', 'world');
  socket.on('*', (data) => {
    const req = qs.decode(JSON.stringify(JSON.parse(data.data[1]).qs));
    delete Object.assign(req, { vk_access_token_settings: req['"vk_access_token_settings'] })['"vk_access_token_settings'];
    if (req.sign && req.vk_user_id) {
      const urlParams = req;
      const ordered = {};
      Object.keys(urlParams).sort().forEach((key) => {
        if (key.slice(0, 3) === 'vk_') {
          ordered[key] = urlParams[key];
        }
      });
      const stringParams = qs.stringify(ordered);
      const paramsHash = crypto
        .createHmac('sha256', config.secretKey)
        .update(stringParams)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '');
      if (paramsHash === urlParams.sign.slice(0, urlParams.sign.length - 1)) {
        routes(socket, data);
      } else {
        socket.emit('error_emit', {
          type: 'error with auth',
        });
      }
    } else {
      socket.emit('error_emit', {
        type: 'error with auth',
      });
    }
  });
});

server.listen(config.serverPort, () => {
  console.log('Server listening on port ', config.serverPort);
});
