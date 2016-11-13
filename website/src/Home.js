import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import './Home.css';
import Form from './Form';
import Logo from './Logo';

const WS = window.WS;
const send = window.send;
const $ = window.$;

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
  play4Pizza() {
    var form_str = $(this._form).serialize().split('&');
    var obj = {};
    form_str.forEach((item) => {
      var parts = item.split('=');
      obj[parts[0]] = parts[1];
    });

    send({ type: 'pizza_payment', details: obj });
  }
  playFree() {
    send({ type: 'new_game', free: true });
  }
  render() {
    var login_cls = '';
    var nav_cls = 'Home-nav';

    if (this.state.logged_in) {
      login_cls = 'faded';
    } else {
      nav_cls += ' faded';
    }

    var loading_msg;
    if (this.state.waiting) {
      loading_msg = <div className="Home-msg">Waiting for another player</div>;
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
          { loading_msg }
          <div className={ nav_cls }>
            <div>
              <button onClick={ this.playFree.bind(this) }>Casual Play</button>
            </div>
            <div>
              <strong>We do not store card details however we currently do not securely handle this information. Use this feature with extreme caution</strong>
              <br/><br/>
              <Form get_ref={ (form) => this._form = form } />
              <button onClick={ this.play4Pizza.bind(this) }>Play for Pizza</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

