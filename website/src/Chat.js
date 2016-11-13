import React, { Component } from 'react';
import './Chat.css';

const send = window.send;
const on_msg = window.on_msg;
const un_msg = window.un_msg;

class Chat extends Component {
  constructor() {
    super();

    this._handler = this.on_msg.bind(this);
    on_msg(this._handler);

    this.state = {
      messages: [
      ]
    };
  }

  componentWillUnmount() {
    un_msg(this._handler);
  }

  on_msg(msg) {
    if (msg.type === 'chat') {
      this.state.messages.shift(msg);
      this.setState({ messages: this.messages });
    }
  }

  render() {
    var msg = [];

    for (var i = 0; i < this.state.messages.length; ++i) {
      var m = this.state.messages[i];
      var cls = 'Chat-user';
      if (m.player === this.props.player) {
        cls += ' me';
      }
      msg.push(
        <div key={ m.id } className="Chat-message">
          <span className={ cls }>{ m.from }:</span>
          { m.msg }
        </div>
      );
    }

    if (!msg.length) {
      msg = '- no messages -';
    }

    return (
      <div className="Chat" style={{ marginTop: this.props.padding, height: this.props.height }}>
        <div className="Chat-messages">
          { msg }
        </div>
        <div className="Chat-input">
          <input type="text" placeholder="Chat here" />
        </div>
      </div>
    );
  }
}



export default Chat;

