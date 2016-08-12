import React, { Component } from 'react'
import Money from '../Money'
import Card from '../Card'
import ResetButton from './ResetButton'

export default class Gameboard extends Component {

  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }

  componentDidMount(){
    this.focusFirstInput()
  }
  componentDidUpdate(){
    this.focusFirstInput()
  }

  focusFirstInput(){
    const inputsSelector = 'button, input[type="button"], input[type="submit"], input[type="text"], input[type="number"]'
    const element = document.querySelector(inputsSelector)
    if (element) {
      element.focus()
      if (element.select) element.select()
    }
  }

  render(){
    window.localStorage.setItem(1, this.props.game)

    const { emit, game } = this.props
    return <div className="Gameboard">
      <EndgameModal emit={emit} game={game} />
      <Dealer emit={emit} game={game} />
      <div className="Gameboard-spacer" />
      <Players emit={emit} game={game} />
      <ResetButton emit={emit} className="Gameboard-reset-button" value="End Game" />
    </div>
  }
}




class Players extends Component {
  render(){
    const { emit, game } = this.props
    const players = game.players.map((player, index) =>
      <Player key={index} emit={emit} game={game} player={player} />
    )
    return <div className="Gameboard-players">{players}</div>
  }
}


class Player extends Component {
  render(){
    const { emit, game, player } = this.props
    const playerIsOut = !game.round.players.includes(player.id)
    const playerHasBet = game.round.playersWhoHaveBet.includes(player.id)
    if (!player.isAi && !playerIsOut && !playerHasBet){
      var betForm = <BetForm emit={emit} player={player} />
    }
    let className = "Gameboard-player"
    if (playerIsOut) className += ' Gameboard-out-this-round'
    return <div className={className}>
      <Hands emit={emit} game={game} player={player} />
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

const Hands = function({ emit, game, player }){
  // let hands = game.round.handsForPlayer(player).map((hand, index)=>
  let hands = game.round.hands.filter(hand => hand.playerId === player.id).map((hand, index)=>
    <Hand emit={emit} key={index} game={game} hand={hand} />
  )
  return <div className="Gameboard-hands">
    {hands}
  </div>
}

class Hand extends Component {
  render(){
    const { emit, game, hand } = this.props
    const hideFirst = false // !game.round.isOver && game.round.currentHand() !== hand
    return <div className="Gameboard-hand">
      <div><strong>Bet: </strong><Money dollars={hand.bet} /></div>
      <div><strong>Value: </strong>{hand.value}</div>
      <Cards cards={hand.cards} hideFirst={hideFirst} />
      <HandActions emit={emit} game={game} hand={hand} />
      <HandBanner game={game} hand={hand} />
    </div>
  }
}

class HandBanner extends Component {
  render(){
    const { game, hand } = this.props
    var banner;
    if (game.round.isOver){
      if (hand.result === 'win'){
        banner = 'WINNER'
      }else if (hand.result === 'loss'){
        banner = 'LOSER'
      }else if (hand.result === 'push'){
        banner = 'PUSH'
      }
    }else if (hand.isBust){
      banner = 'BUSTED'
    }
    return <div className="Gameboard-hand-banner">{banner}</div>
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
    const { emit, hand } = this.props
    emit({
      type: 'hitHand',
      handId: hand.id,
    })
  }
  stay(event){
    event.preventDefault()
    const { emit, hand } = this.props
    emit({
      type: 'stayHand',
      handId: hand.id,
    })
  }
  render(){
    const { game, hand } = this.props
    if (hand.isAi || game.round.actionHandId !== hand.id) return null
    return <div className="Gameboard-hand-actions">
      <button onClick={this.hit}>Hit</button>
      <button onClick={this.stay}>Stay</button>
    </div>
  }
}

class Cards extends Component {
  render(){
    let {cards, hideFirst} = this.props
    cards = cards.map((card, index) =>
      <Card key={index} suit={card.suit} rank={card.rank} faceDown={hideFirst && index === 0} />
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
    var { emit, player } = this.props
    // player.game.round.setPlayerBet(player, bet)
    emit({
      type: 'setBetForPlayer',
      bet: bet,
      playerId: player.id,
    })
  }
  render(){
    var {player} = this.props
    return <form onSubmit={this.placeBet}>
      <input className="bet-input" ref="bet" type="number" defaultValue="1" min="0" max={player.wallet} />
      <button type="submit">Bet</button>
    </form>
  }
}
const Dealer = function({game}){
  return <div className="Gameboard-dealer">
    <Avatar name="Dealer"/>
    <div><strong>Dealer</strong></div>
    <div><strong>Winnings: </strong><Money dollars={game.winnings} /></div>
    <DealersHand game={game} />
  </div>
}

const DealersHand = function({game}){
  var hand = game.round.dealersHand
  var busted = hand.isBust ? 
    <div className="Gameboard-hand-banner">BUSTED</div> : null

  var value = game.round.isOver ? <div><strong>Value: </strong>{hand.value}</div> : null
  return <div className="Gameboard-DealersHand">
    {value}
    <Cards cards={hand.cards} hideFirst={!game.round.isOver} />
    {busted}
  </div>
}

const Pot = function(props){
  return <div className="Gameboard-pot" />
}
class EndgameModal extends Component {
  constructor(){
    super()
    this.newRound = this.newRound.bind(this)
  }

  newRound(){
    this.props.emit({type: 'playAnotherRound'})
  }

  render(){
    const { emit, game } = this.props
    if (!game.round.isOver) return null;
    return <div className="Gameboard-endgame-modal">
      <button onClick={this.newRound}>Play Another Round</button>
      <div><ResetButton emit={emit} /></div>
    </div>
  }
}