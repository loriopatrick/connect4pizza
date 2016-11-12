const WIDTH = 8, HEIGHT = 6, TRAIN = 4;
const EMPTY = '-';

class Game {
  constructor(player_a, player_b) {
    this.game_over = false;

    this.player_a = player_a;
    this.player_b = player_b;

    player_a.move = this.move.bind(this, 'a', player_a);
    player_b.move = this.move.bind(this, 'b', player_b);

    this.next_turn = 'a';
    this.next_turn_id = 1;

    this.board = [];
    for (var col = 0; col < WIDTH; ++col) {
      this.board[col] = new Array(HEIGHT);
      this.board[col].fill(EMPTY);
    }

    this.send_state();
  }

  send_state() {
    var state = {
      game_over: this.game_over,
      my_player: null,
      has_next_turn: false,
      next_turn_id: this.next_turn_id,
      board: this.board,
    };

    if (state.game_over) {
      state.won = this.winner === 'a';
    }

    state.my_player = 'a';
    state.has_next_turn = this.next_turn === 'a';
    this.player_a.send(JSON.stringify(state));

    if (state.game_over) {
      state.won = this.winner === 'b';
    }

    state.my_player = 'b';
    state.has_next_turn = this.next_turn === 'b';
    this.player_b.send(JSON.stringify(state));
  }

  move(player_name, client, move) {
    var result = this._move(player_name, client, move);
    client.send(JSON.stringify(result));

    if (result.type !== 'error') {
      this.send_state();
    }
  }

  _move(player_name, client, move) {
    var board = this.board;

    if (this.game_over) {
      return { type: 'error', error: 'game over' };
    }

    if (player_name !== this.next_turn) {
      return { type: 'error', error: 'not your turn' };
    }

    if ((move < 0) || (move >= WIDTH)) {
      return { type: 'error', error: 'invalid move' };
    }

    for (var i = HEIGHT - 1; i >= 0; --i) {
      if (board[i] == '-') {
        board[i] = client.player_name + '.' + (this.next_turn_id++);
        break;
      }
    }

    if (i == -1) {
      return { type: 'error', error: 'column full' };
    }

    if (playerHasWon(board, player_name)) {
      this.game_over = true;
      this.winner = player_name;
      return { type: 'ok', won: true };
    }

    this.next_turn = this.next_turn === 'a' ? 'b' : 'a';
    return { type: 'ok' };
  }
}

module.exports = Game;

function is_player(item, color) {
  return item.split('.')[0] === color;
}


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
      if (is_player(board[i][k], color)) {
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
      if (is_player(board[k][i], color)) {
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
        if (is_player(board[i + j][k + j], color)) {
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

