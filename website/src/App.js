import React, { Component } from 'react';
import './App.css';

import Home from './Home';

const WS = window.WS;

class App extends Component {
  render() {
    return (
      <div>
        <Home />
      </div>
    );
  }
}

export default App;
