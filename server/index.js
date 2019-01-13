import net from 'net';
import http from 'http';
import restify from 'restify';
import path from 'path';
import bunyan from 'bunyan';
import chalk from 'chalk';

import handleTLS from './utils/handleTLS';

const HTTP_BASE_ADDRESS = 3100;
const HTTP_REDIRECT_ADDRESS = 3001;
const HTTPS_ADDRESS = 3443;

const tcpConnection = conn => {
  conn.on('error', err => console.log('tcp connection error:', err.stack));
  conn.once('data', buf => {
    // A TLS handshake record starts with byte 22
    const address = buf[0] === 22 ? HTTPS_ADDRESS : HTTP_REDIRECT_ADDRESS;
    let proxy = net.createConnection(address, () => {
      proxy.write(buf);
      conn.pipe(proxy).pipe(conn);
    });
  });
};

const httpConnection = (req, res) => {
  const host = req.headers['host'];
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
};

net.createServer(tcpConnection).listen(HTTP_BASE_ADDRESS);
http.createServer(httpConnection).listen(HTTP_REDIRECT_ADDRESS);
// get TLS key and cert object
const httpsOptions = handleTLS();

// * Create Restify http2 server
const server = restify.createServer({
  http2: httpsOptions,
  name: 'starterapp',
  version: '1.0.0',
});

// ensure we don't drop data on uploads
server.pre(restify.pre.pause());
// clean up sloppy paths like //todo/////1//
server.pre(restify.pre.sanitizePath());
// set a per request bunyan logger (with requestid filled in)
server.use(restify.plugins.requestLogger());
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
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.gzipResponse());
server.get('/api', (req, res, next) => {
  res.send({ ok: true });
  return next();
});

// serve static images
server.get(
  '/images',
  restify.plugins.serveStatic({
    directory: path.join(__dirname, '..', 'dist', 'images'),
  })
);

server.get(
  '*',
  restify.plugins.serveStatic({
    directory: path.join(__dirname, '..', 'dist'),
    default: 'index.html',
  })
);

// set up logging
server.on(
  'after',
  restify.plugins.auditLogger({
    event: 'after',
    body: true,
    log: bunyan.createLogger({
      name: 'audit',
      stream: process.stdout,
    }),
  })
);

server.listen(HTTPS_ADDRESS, error => {
  if (error) {
    console.log('https server error: ', error);
    return process.exit(1);
  } else console.log('Restify server listening');
});

process.stdout.write(chalk.yellow(' 💻  served on https://localhost:3100\n'));
