import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import './Home.css';
import Feed from './Feed';
import Logo from './Logo';

const WS = window.WS;
const send = window.send;

class Home extends Component {
  constructor() {
    super();

    this.state = {
      logged_in: false
    };

    this._handler = this.on_msg.bind(this);
    window.on_msg(this._handler);
  }
  componentWillUnmount() {
    window.un_msg(this._handler);
  }
  on_msg(msg) {
    if (msg.type === 'auth') {
      this.setState({ logged_in: true });
    }
    else if (msg.type === 'wait') {
      this.setState({ waiting: true });
    }
  }
  on_fb_login(response) {
    send({ type: 'login', access: response.accessToken });
  }
  play() {
    send({ type: 'new_game' });
  }
  render() {
    var nav_cls = 'Home-nav';
    if (this.state.logged_in) {
      nav_cls += ' first';
    }
    else {
      nav_cls += ' second';
    }

    return (
      <div className="Home">
        <div className="Home-vid">
          <div className="title"><Logo /></div>
          <div className="txt">
            Through honnor the loser buys the winner a pizza after a game of connect 4.
          </div>
        </div>
        <div className={ nav_cls }>
          <FacebookLogin
            appId="915076568593763"
            autoLoad={true}
            fields="name,email,picture"
            callback={this.on_fb_login.bind(this)}
          />
          <span>
            <button onClick={ this.play.bind(this) }>Play for Pizza</button>
          </span>
        </div>
      </div>
    );
  }
}

export default Home;

