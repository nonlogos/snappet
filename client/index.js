import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

import './index.scss';
import App from './App';

// import app icons for browsers/devices
import './assets/launcher-icon-1x.png';
import './assets/launcher-icon-2x.png';
import './assets/launcher-icon-4x.png';
import './assets/launcher-icon-512.png';
import './assets/apple-touch-icon-57x57.png';
import './assets/apple-touch-icon-60x60.png';
import './assets/apple-touch-icon-72x72.png';
import './assets/apple-touch-icon-114x114.png';
import './assets/apple-touch-icon-120x120.png';
import './assets/apple-touch-icon-144x144.png';
import './assets/apple-touch-icon-152x152.png';
import './assets/apple-touch-icon-180x180.png';

// Web Application Manifest
// https://developer.mozilla.org/en-US/docs/Web/Manifest
import './web-app-manifest.json';

const routing = (
  <Router>
    <div>
      <Route path="/" component={App} />
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
