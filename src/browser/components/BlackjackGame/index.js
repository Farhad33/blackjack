import React, { Component } from 'react'
import Setup from './Setup'
import Gameboard from './Gameboard'
import util from 'util'

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
          <pre>{util.inspect(this.props.game)}</pre>
        </div>
      );
    }else{
      return (
        <div className="BlackjackGame">
          <h1>BlackjackGame</h1>
          <Gameboard game={game} />
          <pre>{util.inspect(this.props.game)}</pre>
        </div>
      );
    }
  }
}
