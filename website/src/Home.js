import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import './Home.css';

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
    var main_btn = null;
    if (!this.state.logged_in) {
      main_btn = (
        <FacebookLogin
          appId="915076568593763"
          autoLoad={true}
          fields="name,email,picture"
          callback={this.on_fb_login.bind(this)} />
      );
    }
    else if (!this.state.waiting) {
      main_btn = (
        <div onClick={this.play.bind(this)} className="Home-playbtn">play</div>
      );
    }
    else {
      main_btn = (
        <div className="Home-playbtn">waiting...</div>
      );
    }

    return (
      <div className="Home">
        <div className="Home-logo"></div><br/>
        {main_btn}
      </div>
    );
  }
}

export default Home;

