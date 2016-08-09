import _ from 'lodash'
import Hand from './Hand'
/*
  Represents one round of blackjack
*/
export default class Round {
  constructor(options){
    this.game = options.game;
    this.game.players
    this.game.dealer
    this.game.deck
    this.outPlayers = []
    this.dealersHand = new Hand({});
    this.hands = []
    // this.phase = 'betting' // 'actions'

    // collects bets AKA who is in the round
    // deal two cards to each Hand
    // let each player take actions her hand
    // complete
  }

  handsForPlayer(player){
    return this.hands.filter(hand => hand.player === player)
  }

  setPlayerBet(player, bet){
    console.log('setting player bet', player, bet)
    if (bet > 0){
      var hand = new Hand({
        player: player,
        bet: bet,
      })
      this.hands.push(hand)
    }else{
      this.outPlayers.push(player)
    }

    if (this.allPlayersHaveBet()){
      this.dealTwoCardsToEachHand()
      this.currentPlayer = this.game.players[0]
    }

    this.game.onChange()
    return this;
  }

  playerHasBet(player){
    return (
      this.outPlayers.includes(player) ||
      this.hands.some(hand => hand.player === player)
    )
  }

  allPlayersHaveBet(){
    return this.game.players.every(player =>
      this.playerHasBet(player)
    )
  }

  dealTwoCardsToEachHand(){
    const deck = this.game.deck
    _.times(2, ()=> {
      this.hands.forEach(hand => {
        hand.cards.push(deck.takeOne())
      })
      this.dealersHand.cards.push(deck.takeOne())
    });
  }
}
