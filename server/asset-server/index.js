import fs from 'fs';
import net from 'net';
import http from 'http';
import https from 'https';
import path from 'path';
import bodyParser from 'body-parser';

import chalk from 'chalk';
import express from 'express';

const HTTP_BASE_ADDRESS = 3100;
const HTTP_REDIRECT_ADDRESS = 3001;
const HTTPS_ADDRESS = 3443;

const TLS_KEY_PATH = path.join(__dirname, '..', '..', 'private', 'key.pem');
const TLS_CERT_PATH = path.join(__dirname, '..', '..', 'private', 'cert.pem');

const app = express();

if (!fs.existsSync(TLS_KEY_PATH)) {
  chalk.bgRed.white('X.509 private key was not found.') +
    chalk.red(`\n  ↪ Expected to find it at ${TLS_KEY_PATH}`) +
    chalk.red('\n    Make sure to run ') +
    chalk.yellow('npm run prepcerts') +
    chalk.red(' which should create this file for you');
}
if (!fs.existsSync(TLS_CERT_PATH)) {
  process.stderr.write(
    chalk.bgRed.white('X.509 certificate was not found.') +
      chalk.red(`\n  ↪ Expected to find it at ${TLS_CERT_PATH}`) +
      chalk.red('\n    Make sure to run ') +
      chalk.yellow('npm run prepcerts') +
      chalk.red(' which should create this file for you')
  );
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(TLS_KEY_PATH),
  cert: fs.readFileSync(TLS_CERT_PATH),
};

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
https.createServer(httpsOptions, app).listen(HTTPS_ADDRESS, error => {
  if (error) {
    console.log('https server error: ', error);
    return process.exit(1);
  } else console.log('https server listening');
});

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use('/api', (req, res) => res.json({ ok: true }));

// Run the app by serving the static files in the dist directory
app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

app.get('*', (req, res, next) => {
  const accept = req.headers.accept || '';
  if (accept.indexOf('text/html') < 0) {
    next();
    return;
  }
  const pth = path.join(__dirname, '..', '..', 'dist', 'index.html');
  res.sendFile(pth);
});

process.stdout.write(chalk.yellow(' 💻  UI is served on https://localhost:3100\n'));
