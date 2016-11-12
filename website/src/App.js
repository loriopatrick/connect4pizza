import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import './App.css';

const WS = window.WS;

class App extends Component {
  onClick() {

  }
  onCallback(response) {
    console.log(response);
    WS.send(JSON.stringify({ type: 'login', access: response.accessToken }));
  }
  render() {
    return (
        <div>
        <div>Hello World</div>
        <FacebookLogin
          appId="915076568593763"
          autoLoad={true}
          fields="name,email,picture"
          onClick={this.onClick.bind(this)}
          callback={this.onCallback.bind(this)} />
        </div>
    );
  }
}

export default App;
