import React, { Component } from 'react';
import './Game.css';
import './Home.css';

import Board from './Board';
import Player from './Player';
import Chat from './Chat';
import Logo from './Logo';

const send = window.send;
const on_msg = window.on_msg;
const un_msg = window.un_msg;

class Game extends Component {
  constructor() {
    super();

    this._handler = this.on_msg.bind(this);
    on_msg(this._handler);

    this._resize = this.on_resize.bind(this);
    window.addEventListener('resize', this._resize, true);

    send({ type: 'game_state' });

    this.state = {
      window_width: window.innerWidth,
      next_turn_id: 0,
      board: [
        ['-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-'],
      ],
      game_over: false,
      won: false,
      my_player: 'a',
      has_next_turn: true,
      game_over: false,
      player_a: {},
      player_b: {},
      player_left: false,
    };
  }
  componentWillUnmount() {
    un_msg(this._handler);
    window.removeEventListener('resize', this._resize);
  }
  on_resize() {
    this.setState({ window_width: window.innerWidth });
  }
  on_msg(msg) {
    if (msg.type === 'hello') {
      send({ type: 'new_game' });
    }
    else if (msg.type === 'game_state') {
      this.setState({
        next_turn_id: msg.next_turn_id,
        board: msg.board,
        my_player: msg.my_player,
        has_next_turn: msg.has_next_turn,
        player_a: msg.player_a,
        player_b: msg.player_b,
        game_over: msg.game_over,
        won: msg.won,
        player_left: msg.player_left,
      });
    }
  }
  render() {
    var cols = (this.state.board || []).length;
    var size = this.state.window_width * 0.9 / cols;
    var width_px = size * cols;
    

    var turn;
    if (this.state.my_player === 'a') {
      turn = this.state.has_next_turn ? 'a' : 'b';
    }
    else {
      turn = this.state.has_next_turn ? 'b' : 'a';
    }

    var turn_msg = 'Your turn';
    if (this.state.game_over) {
      if (this.state.won) {
        turn_msg = 'You Won';
      }
      else if (this.state.player_left) {
        turn_msg = 'Other player left';
      }
      else {
        turn_msg = 'You Lost';
      }
    }
    else if (!this.state.has_next_turn) {
      turn_msg = 'Waiting for opponent';
    }

    return (
      <div className="Game">
        <div className="Game-body">
          <Logo />

          <div className="Game-players">
            <Player
              me={this.state.my_player === 'a'}
              turn={turn === 'a'}
              player={this.state.player_a}
            />

            <Player
              me={this.state.my_player === 'b'}
              turn={turn === 'b'}
              player={this.state.player_a}
            />
          </div>
        </div>
        <div className="Game-stripe">
          <div className="Game-body">
            <div
            className="Game-board">
              <Board
                size={size / 2}
                board={this.state.board}
                my_player={this.state.my_player}
                has_next_turn={this.state.has_next_turn}
                next_turn_id={this.state.next_turn_id}
                on_select={this.select.bind(this)}
              />
            </div>
            <Chat
              padding={ size / 2 }
              player={ this.state.my_player }
              height={ size / 2 * this.state.board[0].length }
            />
          </div>
        </div>
        <div className="Game-body Game-msg">{ turn_msg }</div>

      </div>
    );
  }
  select(col) {
    send({ type: 'move', move: col });
  }
}

export default Game;

