import React, { Component } from 'react';
import './Game.css';
import './Home.css';

import Board from './Board';
import Player from './Player';

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

    // send({ type: 'game_state' });

    // temp
    setTimeout(() => { this.on_msg({"type":"game_state","game_over":false,"my_player":"a","has_next_turn":true,"next_turn_id":7,"board":[["-","-","-","-","-","-"],["-","-","-","-","-","a.3"],["-","-","-","-","-","-"],["-","-","b.6","a.5","b.4","a.1"],["-","-","-","-","-","-"],["-","-","-","-","-","b.2"],["-","-","-","-","-","-"],["-","-","-","-","-","-"]],"player_a":{"name":"Patrick Lorio","img":"https://graph.facebook.com/10157639222350401/picture?type=large"},"player_b":{"name":"Patrick Lorio","img":"https://graph.facebook.com/10157639222350401/picture?type=large"},game_over:true, won:false})    }, 100);

    this.state = {
      window_width: window.innerWidth,
      next_turn_id: 0,
      board: [],
      game_over: false,
      won: false,
      my_player: null,
      has_next_turn: false,
      game_over: false,
      player_a: {},
      player_b: {}
    };
  }
  componentWillUnmount() {
    un_msg(this._handler);
    window.removeEventListener('resize', this._resize);
  }
  on_resize() {
    this.setState({ window_width: window.innerWidth });
    console.log('new width', window.innerWidth);
  }
  on_msg(msg) {
    console.log('here', msg);
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
      });
    }
  }
  render() {
    var cols = (this.state.board || []).length;
    var size = Math.min(this.state.window_width * 0.9 / cols, 100);
    var width_px = size * cols;
    
    var won_msg = null;
    if (this.state.game_over) {
      if (this.state.won) {
        won_msg = <div className="Game-msg">You Won</div>;
      }
      else {
        won_msg = <div className="Game-msg">You Lost</div>;
      }
    }

    console.log(this.state.game_over, won_msg);

    return (
      <div className="Game">
        <Player
          me={this.state.my_player === 'a'}
          player={this.state.player_a}
        />
        <div className="Home-logo"></div>
        <Player
          me={this.state.my_player === 'b'}
          player={this.state.player_b}
        />
        <br/>
        {won_msg}
        <div
        style={{ paddingLeft: (window.innerWidth - width_px) / 2 }}
        className="Game-board">
          <Board
            size={size}
            board={this.state.board}
            my_player={this.state.my_player}
            has_next_turn={this.state.has_next_turn}
            next_turn_id={this.state.next_turn_id}
            on_select={this.select.bind(this)}
          />
        </div>
      </div>
    );
  }
  select(col) {
    send({ type: 'move', move: col });
  }
}

export default Game;

