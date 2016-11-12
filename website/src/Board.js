import React, { Component } from 'react';
import './Board.css';

const INPUT_MARGIN = 10;

class Board extends Component {
  constructor() {
    super();

    this.state = {
      input_col: null
    };
  }

  render() {
    var board = this.props.board;
    var size = this.props.size;
    var my_player = this.props.my_player;
    var next_move_id = this.props.next_move_id;
    var width_px = (this.props.board.length || 0) * size;
    var height_px = (1 + (this.props.board[0] || []).length) * size + INPUT_MARGIN;
    
    var components = [];
    for (var col = 0; col < board.length; ++col) {
      for (var row = 0; row < board[col].length; ++row) {
        components.push(
          <div
            key={ 'outline-' + col + '-' + row }
            style={{
              width: size,
              height: size,
              top: (row + 1) * size + INPUT_MARGIN,
              left: col * size
            }}
            className="Board-outline"
          ></div>
        );
      }
    }

    for (var col = 0; col < board.length; ++col) {
      for (var row = 0; row < board[col].length; ++row) {
        var p = this.props.board[col][row];
        if (!p || p === '-') {
          continue;
        }

        var [player, turn] = p.split('.');
        var color = player === my_player ? 'r' : 'y';

        components.push(
            <div
              key={ 'pieces-' + turn }
              style={{
                width: size,
                height: size,
                top: (row + 1) * size + INPUT_MARGIN,
                left: col * size,
              }}
              className={ 'Board-piece Board-piece-' + color }
            ></div>
        );
      }
    }

    if (this.props.allow_input && this.state.input_col !== null) {
      components.push(
          <div
            key={ 'pieces-' + next_move_id }
            style={{
              width: size,
              height: size,
              top: 0,
              left: this.state.input_col * size,
            }}
            className="Board-piece Board-piece-r"
          ></div>
      );
    }

    return (
      <div
        onMouseMove={ this.hover.bind(this) }
        onMouseUp={ this.click.bind(this) }
        onMouseLeave={ this.exit.bind(this) }
        style={{ width: width_px, height: height_px }}
        className="Board"
      >
        { components }
      </div>
    );
  }

  hover(evt) {
    var col = getCol(evt, this.props.size);
    this.setState({
      input_col: col
    });
  }

  click(evt) {
    var col = getCol(evt, this.props.size);
    if (this.props.on_select) {
      this.props.on_select(col);
    }
  }

  exit() {
    this.setState({ input_col: null });
  }
}

function getCol(evt, size) {
  return Math.floor(evt.clientX / size);
}


export default Board;
