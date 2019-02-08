import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  login = () => {
    window.location.href = 'https://127.0.0.1:3100/auth/github';
  };

  apiTest() {
    axios.get('https://localhost:3100/gists?name=hello').then(result => {
      console.log('result', result);
    });
  }

  render() {
    return (
      <>
        <h1>Welcome to Snappet</h1>
        <button onClick={this.login}>Login with Github</button>
        <button onClick={this.apiTest}>api</button>
      </>
    );
  }
}

export default App;
