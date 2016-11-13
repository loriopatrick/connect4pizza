import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import './Home.css';
import Form from './Form';
import Logo from './Logo';

const WS = window.WS;
const send = window.send;

class Home extends Component {
  constructor() {
    super();

    this.state = {
      logged_in: false,
      show_form: true
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
  play4Pizza() {
    send({ type: 'new_game' });
  }
  playFree() {
    // send({ type: 'new_game' });
    this.setState({ show_form: true });
  }
  render() {
    var login_cls = '';
    var nav_cls = 'Home-nav';

    if (this.state.logged_in) {
      login_cls = 'faded';
    } else {
      nav_cls += ' faded';
    }

    return (
      <div className="Home">
        <div className="Home-middle"><Logo /></div>
        <div className="Home-vid">
          <div className="txt">
            It's simple, the loser buys the winner a pizza after a game of connect 4.
          </div>
          <div className={ login_cls }>
            <FacebookLogin
              appId="915076568593763"
              autoLoad={true}
              fields="name,email,picture"
              callback={this.on_fb_login.bind(this)}
              style={{
                margin: '0 auto',
              }}
            />
          </div>
        </div>
        <div className="Home-middle">
          <div className={ nav_cls }>
            <div>
              <button onClick={ this.playFree.bind(this) }>Casual Play</button>
            </div>
            <div>
              <Form />
              <button onClick={ this.play4Pizza.bind(this) }>Play for Pizza</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

