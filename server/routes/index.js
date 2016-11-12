var gameController = require('../lib/game.js');

function route(router) {
    router.route('/')
      .get(gameController.home);

    router.route('/v1/create')
      .get(gameController.create);

    router.route('/v1/makeMove')
      .post(gameController.apply_move);
}

exports.route = route;
