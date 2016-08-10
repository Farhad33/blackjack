import './Gameboard.sass'
import React, { Component } from 'react'
import Money from '../Money'
import Card from '../Card'

export default class Gameboard extends Component {
  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }
  render(){
    const { game } = this.props
    return <div className="Gameboard">
      <Dealer game={game} />
      <Players game={game} />
    </div>
  }
}


class Players extends Component {
  render(){
    const { game } = this.props
    const players = game.players.map((player, index) =>
      <Player key={index} game={game} player={player} />
    )
    return <div className="Gameboard-players">{players}</div>
  }
}


class Player extends Component {
  render(){
    const { game, player } = this.props
    const outThisRound = game.round.outPlayers.includes(player)
    if (!game.round.playerHasBet(player)){
      var betForm = <BetForm player={player} />
    }
    let className = "Gameboard-player"
    if (outThisRound) className += ' Gameboard-out-this-round'
    return <div className={className}>
      <Hands player={player} />
      <div>{betForm}</div>
      <div><Avatar name={player.name} /></div>
      <div><strong>{player.name}</strong></div>
      <div><strong><Money dollars={player.wallet} /></strong></div>
    </div>
  }
}


const Avatar = function(props){
  const height = 100, width = 100;
  // http://lorempixel.com/400/200/people/1/Dummy-Text/
  const src = `http://lorempixel.com/${height}/${width}/people/${props.name}`
  return <img src={src} height={height} width={width} />
}

const Hands = function({ player }){
  const { game } = player
  let hands = game.round.handsForPlayer(player).map((hand, index)=>
    <Hand key={index} game={game} hand={hand} />
  )
  return <div className="Gameboard-hands">
    {hands}
  </div>
}

class Hand extends Component {
  render(){
    const { game, hand } = this.props
    return <div className="Gameboard-hand">
      <div><strong>Bet: </strong><Money dollars={hand.bet} /></div>
      <Cards cards={hand.cards} />
      <HandActions game={game} hand={hand} />
    </div>
  }
}

class HandActions extends Component {
  constructor(){
    super()
    this.hit = this.hit.bind(this)
    this.stay = this.stay.bind(this)
  }
  hit(event){
    event.preventDefault()
    const { game, hand } = this.props
    game.round.hitPlayer(hand.player)
  }
  stay(event){
    event.preventDefault()
    const { game, hand } = this.props
    game.round.stayPlayer(hand.player)
  }
  render(){
    const { game, hand } = this.props
    if (game.round.currentHand() !== hand) return null
    return <div className="Gameboard-hand-actions">
      <button onClick={this.hit}>Hit</button>
      <button onClick={this.stay}>Stay</button>
    </div>
  }
}

class Cards extends Component {
  render(){
    var cards = this.props.cards.map((card, index) =>
      <Card key={index} suit={card.suit} rank={card.rank} faceDown={index === 0} />
    )
    if (cards.length === 0) cards = [<CardPlaceholder key="placeholder"/>]
    return <div className="Gameboard-cards">{cards}</div>
  }
}

const CardPlaceholder = function(props){
  return <div className="Gameboard-card-placeholder" />
}



class BetForm extends Component {
  constructor(){
    super()
    this.placeBet = this.placeBet.bind(this)
  }
  placeBet(event){
    event.preventDefault()
    var bet = parseInt(this.refs.bet.value, 10)
    var {player} = this.props
    player.game.round.setPlayerBet(player, bet)
  }
  render(){
    var {player} = this.props
    return <form onSubmit={this.placeBet}>
      <input ref="bet" type="number" defaultValue="0" min="0" max={player.wallet} />
      <button type="submit">Bet</button>
    </form>
  }
}
const Dealer = function({game}){
  return <div className="Gameboard-dealer">
    <Avatar name="Dealer"/>
    <div><strong>Dealer</strong></div>
    <DealersHand game={game} />
  </div>
}

const DealersHand = function({game}){
  var cards = game.round.dealersHand.cards

  return <div className="Gameboard-DealersHand">
    <Cards cards={cards} />
  </div>
}

const Pot = function(props){
  return <div className="Gameboard-pot" />
}
