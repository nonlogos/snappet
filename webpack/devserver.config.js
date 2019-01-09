/* eslint-env node */
const fs = require('fs');

module.exports = () => {
  return {
    port: 3000,
    open: true,
    stats: {
      colors: true,
    },
    https: {
      key: fs.readFileSync('./private/key.pem'),
      cert: fs.readFileSync('./private/cert.pem'),
    },
    proxy: {
      '/api': 'https://localhost:3100',
    },
  };
};
