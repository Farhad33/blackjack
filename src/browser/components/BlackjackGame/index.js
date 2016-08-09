import React, { Component } from 'react'
import Setup from './Setup'
import Gameboard from './Gameboard'

export default class BlackjackGame extends Component {
  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }

  render() {

    const { game } = this.props

    if (!game.setup){
       return (
        <div className="BlackjackGame">
          <h1>BlackjackGame</h1>
          <Setup game={game} />
          <pre>{JSON.stringify(this.props.game, null, 4)}</pre>
        </div>
      );     
    }else{
      return (
        <div className="BlackjackGame">
          <h1>BlackjackGame</h1>
          <Gameboard game={game} />
          <pre>{JSON.stringify(this.props.game, null, 4)}</pre>
        </div>
      );
    }
  }
}
