import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import VAPID from './../private/vapid.json';

// import app icons for browsers/devices
import 'file-loader?name=./images/launcher-icon-1x.png!./images/launcher-icon-1x.png';
import 'file-loader?name=./images/launcher-icon-2x.png!./images/launcher-icon-2x.png';
import 'file-loader?name=./images/launcher-icon-4x.png!./images/launcher-icon-4x.png';
import 'file-loader?name=./images/apple-touch-icon-57x57.png!./images/apple-touch-icon-57x57.png';
import 'file-loader?name=./images/apple-touch-icon-60x60.png!./images/apple-touch-icon-60x60.png';
import 'file-loader?name=./images/apple-touch-icon-72x72.png!./images/apple-touch-icon-72x72.png';
import 'file-loader?name=./images/apple-touch-icon-76x76.png!./images/apple-touch-icon-76x76.png';
import 'file-loader?name=./images/apple-touch-icon-114x114.png!./images/apple-touch-icon-114x114.png';
import 'file-loader?name=./images/apple-touch-icon-120x120.png!./images/apple-touch-icon-120x120.png';
import 'file-loader?name=./images/apple-touch-icon-144x144.png!./images/apple-touch-icon-144x144.png';
import 'file-loader?name=./images/apple-touch-icon-152x152.png!./images/apple-touch-icon-152x152.png';
import 'file-loader?name=./images/apple-touch-icon-180x180.png!./images/apple-touch-icon-180x180.png';
import 'file-loader?name=./images/apple-touch-icon-180x180.png!./images/apple-touch-icon-180x180.png';

// Web Application Manifest
// https://developer.mozilla.org/en-US/docs/Web/Manifest
// const manifest = require('./web-app-manifest.json');
import './web-app-manifest.json';

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
