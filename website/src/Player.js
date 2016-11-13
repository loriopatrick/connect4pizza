import React, { Component } from 'react';
import './Player.css';

class Player extends Component {
  render() {
    var cls;
    if (this.props.me) cls += ' me';
    if (this.props.turn) cls += ' turn';
    return (
      <div className="Player">
        <img className={cls} src={ this.props.player.img } width={this.props.width || 80} />
        <span>{ this.props.player.name }</span>
      </div>
    );
  }
}


export default Player;
