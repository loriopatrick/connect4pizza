const express   = require( 'express');
const routeGame = require( './routes/index.js');

const router = express.Router();

routeGame.route(router);

exports.router = router;
