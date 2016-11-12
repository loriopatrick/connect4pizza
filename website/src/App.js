import React, { Component } from 'react';
import './App.css';

import Board from './Board';

var ws = new window.WebSocket('ws://localhost:8080');

class App extends Component {
  constructor() {
    super();

    ws.onmessage = function(msg) {
      msg = JSON.parse(msg.data);
      if (msg.type === 'hello') {
        ws.send(JSON.stringify({ type: 'new_game' }));
      }
      console.log(msg);
    };

    this.state = {
      next_turn_id: 6,
      board: [
        [ '-', '-', '-', '-' ],
        [ '-', '-', 'a.2', 'b.1' ],
        [ '-', 'b.5', 'a.4', 'b.3' ],
        [ '-', '-', '-', '-' ],
        [ '-', '-', '-', '-' ],
        [ '-', '-', '-', '-' ],
      ]
    };
  }
  render() {
    return (
      <div className="App">
      Hello World
      <Board
        size={100}
        board={this.state.board}
        my_player={'a'}
        has_next_turn={true}
        next_turn_id={this.state.next_turn_id}
        on_select={this.select.bind(this)}
      />
      </div>
    );
  }
  select(col) {
    this.setState({
      next_turn_id: 7,
      board: [
        [ '-', '-', '-', '-' ],
        [ '-', 'a.6', 'a.2', 'b.1' ],
        [ '-', 'b.5', 'a.4', 'b.3' ],
        [ '-', '-', '-', '-' ],
        [ '-', '-', '-', '-' ],
        [ '-', '-', '-', '-' ],
      ]
    });
  }
}

export default App;
