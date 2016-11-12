const WIDTH = 8, HEIGHT = 6, TRAIN = 4;
const YELLOW = 'y', RED = 'r', EMPTY = '-';

function home(req, res) {
  res.send('its working..');
}

function create(req, res) {
  var board = [];
  for (var col = 0; col < WIDTH; ++col) {
    board[col] = new Array(HEIGHT);
    board[col].fill(EMPTY);
  }
  return res.json({board: board, next_move_id: 1});
}

/** Endpoint to make a move on a board
* @param board - 2D array of board state
* @param move - int representing column to drop color
* @param color - either YELLOW or RED;
**/
function apply_move(req, res) {
  var board = req.body.board;
  var move = req.body.move;
  var color = req.body.color;
  if ((move < 0) || (move >= WIDTH)) {
    return res.status(400).json({error: 'Invalid move.'});
  }
  for (var i = HEIGHT - 1; i >= 0; --i) {
    if (board[i] == '-') {
      board[i] = color;
      break;
    }
  }
  if (playerHasWon(board, color)) {
    // do payment transfer stuff here
    return res.status(201).json({winner: color});
  }
  return res.sendStatus(200);
}

module.exports.home = home;
module.exports.create = create;
module.exports.apply_move = apply_move;

/** Checks board if color has won.
* @param board - 2D array of board state
* @param color - either YELLOW or RED;
* @return boolean describing color has won.
**/
function playerHasWon(board, color) {
  return checkHorizontals(board, color) || checkVerticals(board, color) || checkDiagonals(board, color);
}

/** Checks board if there is horizontal COLOR in a row.
* @param board - 2D array of board state
* @param color - either YELLOW or RED;
* @return boolean describing if one exist.
**/
function checkHorizontals(board, color) {
  var total = 0;
  for (var i = 0; i < HEIGHT; ++i) {
    for (var k = 0; i < WIDTH; ++k) {
      if (board[i][k] == color) {
        total += 1;
        if (total >= TRAIN) {
          return true;
        }
      } else {
        total = 0;
      }
    }
  }
  return false;
}

/** Checks board if there is vertical COLOR in a row.
* @param board - 2D array of board state
* @param color - either YELLOW or RED;
* @return boolean describing if one exist.
**/
function checkVerticals(board, color) {
  var total = 0;
  for (var i = 0; i < WIDTH; ++i) {
    for (var k = 0; i < HEIGHT; ++k) {
      if (board[k][i] == color) {
        total += 1;
        if (total >= TRAIN) {
          return true;
        }
      } else {
        total = 0;
      }
    }
  }
  return false;
}

/** Checks board if there is diagonal COLOR in a row.
* @param board - 2D array of board state
* @param color - either YELLOW or RED;
* @return boolean describing if one exist.
**/
function checkDiagonals(board, color) {
  var total = 0;
  for (var i = 0; i < HEIGHT - TRAIN + 1; ++i) {
    for (var k = 0; i < WIDTH - TRAIN + 1; ++k) {
      for (var j = 0; i < TRAIN; ++i) {
        if (board[i + j][k + j] == color) {
          total += 1;
          if (total >= TRAIN) {
            return true;
          }
        } else {
          total = 0;
        }
      }
    }
  }
  return false;
}

