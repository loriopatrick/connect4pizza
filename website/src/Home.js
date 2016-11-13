import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import './Home.css';
import Feed from './Feed';

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
    var facebook_btn = null;
    var play_btn = null;
    var video = (<div className="Video">Video</div>);
    var feed = null;
    if (!this.state.logged_in) {
      facebook_btn = (
        <div className="Home-btn">
        <FacebookLogin
          appId="915076568593763"
          autoLoad={true}
          fields="name,email,picture"
          callback={this.on_fb_login.bind(this)} />
          </div>
      );
      play_btn = (
        <div className="Grayed Home-btn">
        <div onClick={this.play.bind(this)} className="Home-playbtn">play</div>
        </div>
      );
    }
    else {
      facebook_btn = (
        <div className="Grayed Home-btn">
        <FacebookLogin
          appId="915076568593763"
          autoLoad={true}
          fields="name,email,picture"
          callback={this.on_fb_login.bind(this)} />
        </div>
      );
      if (!this.state.waiting) {
        play_btn = (
          <div className="Home-btn">
          <div onClick={this.play.bind(this)}   className="Home-playbtn">play</div>
          </div>
        );
      }
      else {
        play_btn = (
          <div className="Home-btn">
          <div className="Home-playbtn">waiting...</div>
          </div>
        );
      }
    }

    return (
      <div className="Home">
        <div className="Home-logo"></div><br/>
        {video}
        {facebook_btn}
        {play_btn}
        <Feed />
      </div>
    );
  }
}

export default Home;

