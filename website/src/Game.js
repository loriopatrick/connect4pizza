import React, { Component } from 'react';
import './Game.css';

import Board from './Board';

class Game extends Component {
  constructor() {
    super();

    WS.onmessage = (msg) => {
      msg = JSON.parse(msg.data);
      if (msg.type === 'hello') {
        WS.send(JSON.stringify({ type: 'new_game' }));
      }
      else if (msg.type === 'state') {
        this.setState({
          next_turn_id: msg.next_turn_id,
          board: msg.board,
          my_player: msg.my_player,
          has_next_turn: msg.has_next_turn,
        });
      }
      console.log(msg);
    };

    this.state = {
      next_turn_id: 0,
      board: [],
      my_player: null,
      has_next_turn: false,
    };
  }
  render() {
    return (
      <div className="Game">
      Hello World
      <Board
        size={100}
        board={this.state.board}
        my_player={this.state.my_player}
        has_next_turn={this.state.has_next_turn}
        next_turn_id={this.state.next_turn_id}
        on_select={this.select.bind(this)}
      />
      </div>
    );
  }
  select(col) {
    WS.send(JSON.stringify({ type: 'move', move: col }));
  }
}

export default Game;

