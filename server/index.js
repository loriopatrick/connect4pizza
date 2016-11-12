const WebSocketServer = require('ws').Server;
const Game = require('./lib/game');

var server = new WebSocketServer({ port: 8080 });
console.log('server started on port 8080');

var looking_for_game = null;

server.on('connection', function(client) {
  client.on('message', function(msg) {
    msg = JSON.parse(msg);

    if (msg.type === 'new_game') {
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
