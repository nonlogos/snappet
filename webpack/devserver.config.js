/* eslint-env node */
const fs = require('fs');
const path = require('path');

module.exports = () => {
  return {
    port: 3000,
    open: true,
    contentBase: path.join(__dirname, 'client'),
    watchContentBase: true,
    historyApiFallback: true,
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
