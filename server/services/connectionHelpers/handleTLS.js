import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const devMode = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod';

// * helper functions------------------------------------
/**
 *
 * exit process and log error if TLS key or cert are not found
 * @param {boolean} cond
 * @param {string} path
 */
const _handleTLSNotExist = (cond, path) => {
  if (!cond) {
    process.stderr.write(
      chalk.bgRed.white('X.509 certificate was not found.') +
        chalk.red(`\n  ↪ Expected to find it at ${path}`) +
        chalk.red('\n    Make sure to run ') +
        chalk.yellow('npm run prepcerts') +
        chalk.red(' which should create this file for you')
    );
    process.exit(1);
  }
};

// * end helper functions------------------------------------

/**
 * Check if TLS key and cert exist. If so returns https options object
 * else exit process with error message
 * @param {null}
 * @returns {object}
 */
const handleTLS = () => {
  const TLS_KEY_PATH = devMode
    ? path.join(__dirname, '..', '..', '..', 'private', 'key.pem')
    : path.join(__dirname, '..', 'key.pem');
  const TLS_CERT_PATH = devMode
    ? path.join(__dirname, '..', '..', '..', 'private', 'cert.pem')
    : path.join(__dirname, '..', 'cert.pem');
  const isKeyExist = fs.existsSync(TLS_KEY_PATH);
  const isCertExist = fs.existsSync(TLS_CERT_PATH);
  // exit process if no TLS cert or key is found
  _handleTLSNotExist(isKeyExist, TLS_KEY_PATH);
  _handleTLSNotExist(isCertExist, TLS_CERT_PATH);

  return {
    key: fs.readFileSync(TLS_KEY_PATH),
    cert: fs.readFileSync(TLS_CERT_PATH),
  };
};

export default handleTLS;
