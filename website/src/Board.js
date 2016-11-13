import React, { Component } from 'react';
import './Board.css';

const INPUT_MARGIN = 10;
const $ = window.$;

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
    var next_turn_id = this.props.next_turn_id;
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
                top: (row + 1) * size + INPUT_MARGIN + 1,
                left: col * size + 1,
              }}
              className={ 'Board-piece Board-piece-' + color }
            ></div>
        );
      }
    }

    if (this.props.has_next_turn && this.state.input_col !== null) {
      components.push(
          <div
            key={ 'pieces-' + next_turn_id }
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
    else {
      components.push(
          <div
            key={ 'pieces-' + next_turn_id }
            style={{
              width: 0,
              height: 0,
              top: 0,
              left: -size,
            }}
            className="Board-piece Board-piece-r"
          ></div>
      );
    }

    return (
      <div
        ref={ (ref) => this._board_ref = ref }
        onMouseMove={ this.hover.bind(this) }
        onMouseUp={ this.click.bind(this) }
        onMouseLeave={ this.exit.bind(this) }
        style={{ width: width_px, height: height_px }}
        className="Board"
      >
        { components }
        <div className="Board-border" style={{
          top: size + 2
        }}></div>
      </div>
    );
  }

  hover(evt) {
    var col = this.getCol(evt, this.props.size);
    this.setState({
      input_col: col
    });
  }

  click(evt) {
    var col = this.getCol(evt, this.props.size);
    if (this.props.on_select) {
      this.props.on_select(col);
    }
  }

  exit() {
    this.setState({ input_col: null });
  }
  getCol(evt, size) {
    return Math.max(Math.min(Math.floor((evt.clientX - $(this._board_ref).offset().left) / size), this.props.board.length - 1), 0);
  }
}



export default Board;
