import net from 'net';
import http from 'http';
import path from 'path';
import bunyan from 'bunyan';
import chalk from 'chalk';
import restify from 'restify';
import CookieParser from 'restify-cookies';
import corsMiddleware from 'restify-cors-middleware';

import authRouter from './routes/authRoutes';
import gistRouter from './routes/gistRoutes';
import handleTLS from './services/connectionHelpers/handleTLS';
import {
  tcpConnection,
  httpConnection,
  HTTP_BASE_ADDRESS,
  HTTP_REDIRECT_ADDRESS,
  HTTPS_ADDRESS,
} from './services/connectionHelpers/handleTCP-HTTP';
import MongoConnect from './services/connectionHelpers/setUpMongoose';
import { isAuthenticated } from './middlewares/auth';

// * handle tcp/https(2) connection and http redirect
net.createServer(tcpConnection).listen(HTTP_BASE_ADDRESS);
http.createServer(httpConnection).listen(HTTP_REDIRECT_ADDRESS);
// get TLS key and cert object
const httpsOptions = handleTLS();

// * Create Restify http2 server
const server = restify.createServer({
  http2: httpsOptions,
  allowHTTP1: true,
  name: 'Snappet',
  version: '0.0.1',
});

const cors = corsMiddleware({
  origins: ['https//localhost:3100'],
  allowHeaders: ['API-Token', 'Access-Control-Allow-Credentials, Access-Control-Allow-Origin'],
  exposeHeaders: ['API-Token-Expiry', 'Access-Control-Allow-Credentials'],
  credentials: true,
});

// * Global Middlewares
// ensure we don't drop data on uploads
server.pre(restify.pre.pause());
// clean up sloppy paths like //todo/////1//
server.pre(restify.pre.sanitizePath());
// set a per request bunyan logger (with requestid filled in)
server.use(restify.plugins.requestLogger());
server.pre(cors.preflight);

server.pre(function(req, res, next) {
  req.header('withCredentials', true);
  return next();
});

// allow 5 requests/second by IP, and burst to 10
server.use(
  restify.plugins.throttle({
    burst: 10,
    rate: 5,
    ip: true,
  })
);

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.dateParser());
server.use(
  restify.plugins.bodyParser({
    mapParams: true,
  })
);
server.use(cors.actual);
server.use(restify.plugins.gzipResponse());
server.use(CookieParser.parse);

// * Apply child routes
authRouter.applyRoutes(server);
gistRouter.applyRoutes(server);

// * serve static html and images
// TODO: test paths on prod build and client dev build
const devMode = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod';
const assetsPath = devMode ? path.join(__dirname, '..', 'dist', 'assets') : path.join(__dirname, '..', 'assets');
const htmlPath = devMode ? path.join(__dirname, '..', 'dist') : path.join(__dirname, '..');
// serve static images
server.get(
  '/images',
  restify.plugins.serveStatic({
    directory: assetsPath,
  })
);

server.get(
  '*',
  isAuthenticated,
  restify.plugins.serveStatic({
    directory: htmlPath,
    default: 'index.html',
  })
);

// * log requests
// server.on(
//   'after',
//   restify.plugins.auditLogger({
//     event: 'after',
//     body: true,
//     log: bunyan.createLogger({
//       name: 'audit',
//       stream: process.stdout,
//     }),
//   })
// );

server.listen(HTTPS_ADDRESS, error => {
  if (error) {
    console.log(`https server error: ${error}`);
    return process.exit(1);
  }
  // * Connect to MongoDB:MLab via Mongoose
  MongoConnect.connect(process.env.DB_CONN);
});

process.stdout.write(chalk.yellow(' 💻  served on https://localhost:3100\n'));
