import React, { Component } from 'react'

export default class Gameboard extends Component {
  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }

  render(){
    const { game } = this.props
    return <div>
      <Players game={game} />
    </div>
  }
}


class Players extends Component {
  render(){
    const { game } = this.props
    const players = game.players.map(player => 
      <Player game={game} player={player} />
    )
    return <div className="players">{players}</div>
  }
}


class Player extends Component {
  render(){
    const { game, player } = this.props
    return <div className="Player">
      <div>Name: {player.name}</div>
    </div>
  }
}