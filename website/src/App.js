import React, { Component } from 'react';
import './App.css';

var WS = window.WS = new window.WebSocket('ws://localhost:8080');

class App extends Component {
  render() {
    return (
        <div>Hello World</div>
    );
  }
}

export default App;
