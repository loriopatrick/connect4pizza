import React, { Component } from 'react';
import './Feed.css';

class Feed extends Component {
  constructor() {
    super();
    this.state = {
      games: [
        { player_a: {
            name: 'Happy Doge',
            picture_url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSm1inz3TND4nHTX0hQyU502F5OyICRkoz-Cx480ACMiEPnabABbb33670',
          },
          player_b: {
            name: 'Owl',
            picture_url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRPUQ2hLXvwaGNaHOqKoIDd_ZSthYfYwHiWGP8NDK2Uvbj2ABrO'
          },
          winner: 'a',
        },
        { player_a: {
            name: 'Paul Hilfinger',
            picture_url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQPJ-PMKflDPg_JOX6pZOm1snfFqjYb8_aPiJTe6V2LXfLOb6v298xe5Q',
          },
          player_b: {
            name: 'Cat Fish',
            picture_url: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRPS_WMZO99hJR4sTzCoGU7vKHNwfA87Lx3ULuTvF-LMUQML45b'
          },
          winner: 'b',
        }
      ]
    }
  }

  render() {
    var activity = [];
    for (var i = 0; i < this.state.games.length; i++) {
      var game = this.state.games[i];
      var winner = null;
      var loser = null;
      if (game.winner == 'a') {
        winner = game.player_a;
        loser = game.player_b;
      } else {
        winner = game.player_b;
        loser = game.player_a;
      }
      var phrase = winner.name +
        ' owes ' + loser.name + ' a pizza!';
      activity.push(
        <div className="Recent-Game">
        <div className="Feed-Picture"
          style={{
            backgroundImage: 'url(' + winner.picture_url + ')'
          }}> </div>
          <div className="Phrase">{phrase}</div>
        <div className="Feed-Picture"
        style={{
          backgroundImage: 'url(' + loser.picture_url + ')'
        }}> </div>
        </div>
      );
    }
    return (
      <div className="Feed-Container">
      <div className="Feed-Title"> RECENT GAMES </div>
      {activity}
      </div>
    );
  }

}

export default Feed;
