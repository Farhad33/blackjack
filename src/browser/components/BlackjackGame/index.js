import './index.sass'
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
    const content = !game.setup ?
      <Setup game={game} /> :
      <Gameboard game={game} />
    return <div className="BlackjackGame">
      {content}
    </div>
  }
}
