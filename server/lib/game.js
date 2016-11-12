
function create(width, height) {
  var board = [];
  for (var col = 0; col < width; ++col) {
    board[col] = new Array(height);
  }
  return board;
}

function apply_move(board, move) {
  // TODO
}

module.exports.create = create;
module.exports.apply_move = apply_move;
