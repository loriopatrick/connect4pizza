import React, { Component } from 'react';
import './App.css';

import Board from './Board';

class App extends Component {
  constructor() {
    super();

    this.state = {
      next_move: 6,
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
        allow_input={true}
        next_move_id={this.state.next_move}
        on_select={this.select.bind(this)}
      />
      </div>
    );
  }
  select(col) {
    this.setState({
      next_move: 7,
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
