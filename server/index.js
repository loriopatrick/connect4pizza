const WebSocketServer = require('ws').Server;
const Game = require('./lib/game');

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

    if (msg.type === 'new_game') {
      if (client.state === 'no_auth') {
        return client.error('you must first log in');
      }

      if (looking_for_game === null) {
        looking_for_game = client;
      }
      else {
        new Game(client, looking_for_game);
      }
    }

    else if (msg.type === 'move') {
      client.move(msg.move);
    }
  });

  client.on('close', function() {
    if (client === looking_for_game) {
      looking_for_game = null;
    }
  });

  client.send(JSON.stringify({ type: 'hello' }));
});
