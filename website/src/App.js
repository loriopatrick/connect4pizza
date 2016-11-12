import React, { Component } from 'react';
import './App.css';

import Home from './Home';
import Game from './Game';

const send = window.send;
const on_msg = window.on_msg;
const un_msg = window.un_msg;

class App extends Component {
  constructor() {
    super();

    this.state = {
      page: 'home'
    };

    this._handler = this.on_msg.bind(this);
    on_msg(this._handler);
  }

  componentWillUnmount() {
    un_msg(this._handler);
  }

  on_msg(msg) {
    if (msg.type === 'game_state') {
      this.setState({ page: 'game' });
    }
    else if (msg.type === 'user_details') {
      this.setState({
        user_details: {
          name: msg.name,
          img: msg.img,
        }
      });
    }
  }

  render() {
    var page = null;

    if (this.state.page === 'home') {
      page = <Home user={this.state.user_details} />;
    }
    else if (this.state.page === 'game') {
      page = <Game user={this.state.user_details} />;
    }

    return (
      <div>
        { page }
      </div>
    );
  }
}

export default App;
