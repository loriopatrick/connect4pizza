const WIDTH = 8, HEIGHT = 6, TRAIN = 4;
const EMPTY = '-';

class Game {
  constructor(player_a, player_b) {
    this.game_over = false;

    this.player_a = player_a;
    this.player_b = player_b;

    player_a.state = 'in_game';
    player_b.state = 'in_game';

    player_a.move = this.move.bind(this, 'a', player_a);
    player_a.leave = this.leave.bind(this, player_a);
    player_b.move = this.move.bind(this, 'b', player_b);
    player_b.leave = this.leave.bind(this, player_b);

    player_a.send_state = this.send_state.bind(this);
    player_b.send_state = this.send_state.bind(this);

    this.next_turn = 'a';
    this.next_turn_id = 1;

    this.board = [];
    for (var col = 0; col < WIDTH; ++col) {
      this.board[col] = new Array(HEIGHT);
      this.board[col].fill(EMPTY);
    }

    this.player_a_details = {
      name: this.player_a.fb_user.name,
      img: this.player_a.fb_user.profile_image,
    };

    this.player_b_details = {
      name: this.player_b.fb_user.name,
      img: this.player_b.fb_user.profile_image,
    };

    this.send_state();
  }

  leave(client) {
    if (client === this.player_a) {
      this.player_a = null;
    }
    else if (client === this.player_b) {
      this.player_b = null;
    }

    if (this.player_a) {
      this.player_a.state = 'auth';
      this.player_a.json({ type: 'game_over', reason: 'leave' });
    }

    if (this.player_b) {
      this.player_b.state = 'auth';
      this.player_b.json({ type: 'game_over', reason: 'leave' });
    }

    this.game_over = true;
    this.player_left = true;
    this.send_state();
  }

  send_state() {
    var state = {
      type: 'game_state',
      game_over: this.game_over,
      my_player: null,
      has_next_turn: false,
      next_turn_id: this.next_turn_id,
      board: this.board,
      player_a: this.player_a_details,
      player_b: this.player_b_details,
      player_left: this.player_left
    };

    if (state.game_over) {
      state.won = this.winner === 'a';
    }

    state.my_player = 'a';
    state.has_next_turn = this.next_turn === 'a';
    if (this.player_a) {
      this.player_a.send(JSON.stringify(state));
    }

    if (state.game_over) {
      state.won = this.winner === 'b';
    }

    state.my_player = 'b';
    state.has_next_turn = this.next_turn === 'b';
    if (this.player_b) {
      this.player_b.send(JSON.stringify(state));
    }
  }

  move(player_name, client, move) {
    var result = this._move(player_name, client, move);
    client.json(result);

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
      if (board[move][i] === '-') {
        board[move][i] = player_name + '.' + (this.next_turn_id++);
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
    for (var k = 0; k < WIDTH; ++k) {
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

/** Checks board if there is vertical COLOR in a row.
* @param board - 2D array of board state
* @param color - either YELLOW or RED;
* @return boolean describing if one exist.
**/
function checkVerticals(board, color) {
  var total = 0;
  for (var i = 0; i < WIDTH; ++i) {
    for (var k = 0; k < HEIGHT; ++k) {
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

/** Checks board if there is diagonal COLOR in a row.
* @param board - 2D array of board state
* @param color - either YELLOW or RED;
* @return boolean describing if one exist.
**/
function checkDiagonals(board, color) {
  var total = 0;
  for (var i = 0; i < HEIGHT - TRAIN + 1; ++i) {
    for (var k = 0; k < WIDTH - TRAIN + 1; ++k) {
      for (var j = 0; j < TRAIN; ++j) {
        if (is_player(board[k + j][i + j], color)) {
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

  total = 0;
  for (var i = TRAIN - 1; i < HEIGHT; ++i) {
    for (var k = 0; k < WIDTH - TRAIN + 1; ++k) {
      for (var j = 0; j < TRAIN; ++j) {
        if (is_player(board[k + j][i - j], color)) {
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

