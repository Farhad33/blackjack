import './index.sass'
import React, { Component } from 'react'
import Setup from './Setup'
import Gameboard from './Gameboard'
import ResetButton from './ResetButton'


export default class BlackjackGame extends Component {
  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }

  render() {
    const { game, emit } = this.props
    const content = !game.setup ?
      <Setup game={game} emit={emit} /> :
      (game.round) ?
        <Gameboard game={game} emit={emit} /> :
        <Gameover game={game} emit={emit} />

    return <div className="BlackjackGame">
      {content}
    </div>
  }
}

class Gameover extends Component {
  render(){
    return <div className="BlackjackGame-gameover">
      <h1>Game Over :(</h1>
      <h4>Thanks for all the cash</h4>
      <ResetButton emit={this.props.emit} value="New Game" />
    </div>
  }
}

