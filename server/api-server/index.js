import chalk from 'chalk';
import express from 'express';
import cors from 'cors';
import path from 'path';
import https from 'https';
import bodyParser from 'body-parser';
import debug from 'debug';
// import router from './router';
// import NotificationManager from './utils/notification';
import getDevelopmentCertificate from 'devcert-with-localhost';

const startAndListen = (app, port) => {
  return new Promise(resolve => {
    app.listen(port, () => resolve());
  });
};

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    callback(null, true);
  },
};

class ApiServer {
  constructor() {
    this.notifications = null;
  }

  _startApi() {
    this.app = express();
    this.app.disable('x-powered-by');
    this.app.use(bodyParser.json());
    this.app.use('/api', (req, res) => res.json({ ok: true }));
    this.app.use('/images', express.static(path.join(__dirname, '..', 'images')));
    this.app.use('/', express.static(path.join(__dirname, '..', '..', 'dist')));
    debug('attempting to get certificate');
    return getDevelopmentCertificate('starterApp', { installcertutil: true }).then(ssl => {
      debug('SSL configuration received. starting app server');
      return startAndListen(https.createServer(ssl, this.app), 3100);
    });
  }

  async start() {
    //start or connect to db
    await this._startApi();
    process.stdout.write(chalk.magenta(' API has started on https://localhost:3100/api\n'));
  }
}

const api = new ApiServer();
api.start();
