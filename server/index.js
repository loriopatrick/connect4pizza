const WebSocketServer = require('ws').Server;
const Game = require('./lib/game');
const facebook_login = require('./lib/facebook');

var server = new WebSocketServer({ port: 8080 });
console.log('server started on port 8080');

var looking_for_game = null;

server.on('connection', function(client) {
  client.state = 'no_auth';

  client.json = function(msg) {
    client.send(JSON.stringify(msg));
  };

  client.error = function(msg) {
    client.json({ type: 'error', error: msg });
  };

  client.on('message', function(msg) {
    msg = JSON.parse(msg);

    if (msg.type === 'login') {
      if (client.state !== 'no_auth') {
        return client.error('already signed in');
      }

      if (!msg.access) {
        return client.error('you must login with facebook');
      }

      facebook_login(client, msg.access);
    }

    else if (msg.type === 'new_game') {
      if (client.state !== 'auth') {
        if (client.state === 'no_auth') {
          return client.error('you must first log in');
        }
        if (client.state === 'in_game') {
          return client.error('you are currently in a game');
        }
        return client.error('you cannot join a game while in the ' + client.state + ' state');
      }

      if (looking_for_game === null) {
        looking_for_game = client;
      }
      else {
        new Game(client, looking_for_game);
      }
    }

    else if (msg.type === 'move') {
      if (client.state !== 'in_game') {
        return client.error('you are currently not in a game (' + client.state + ')');
      }
      client.move(msg.move);
    }
  });

  client.on('close', function() {
    if (client === looking_for_game) {
      looking_for_game = null;
    }

    if (client.leave) {
      client.leave();
    }
  });

  client.send(JSON.stringify({ type: 'hello' }));
});
