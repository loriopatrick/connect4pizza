import React, { Component } from 'react';
import './Player.css';

class Player extends Component {
  render() {
    var cls = 'Player';
    if (this.props.me) cls += ' me';
    if (this.props.turn) cls += ' turn';
    return (
      <div className={cls}>
        <img src={ this.props.player.img } width={200} />
        <span>{ this.props.player.name }</span>
      </div>
    );
  }
}


export default Player;
