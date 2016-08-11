import _ from 'lodash'
import Hand from './Hand'
/*
  Represents one round of blackjack
*/
export default class Round {
  constructor(options){
    this.isOver = false
    this.game = options.game;

    this.dealersHand = new Hand({});
    this.outPlayers = this.game.players.filter(player => player.wallet <= 0)
    this.hands = []
    this.currentHandIndex = null;

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
      if (bet > player.wallet) return;
      var hand = new Hand({
        player: player,
        bet: bet,
      })
      player.wallet -= bet
      this.hands.push(hand)
    }else{
      this.outPlayers.push(player)
    }

    if (this.allPlayersHaveBet()){
      this.hands = _.sortBy(this.hands, hand => this.game.players.indexOf(hand.player));
      this.dealTwoCardsToEachHand()
      this.currentHandIndex = 0;
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

  currentHand(){
    return this.currentHandIndex === null ?
      false : this.hands[this.currentHandIndex]
  }

  isPlayersTurn(player){
    var hand = this.currentHand()
    return hand && hand.player === player
  }

  endPlayersTurn(){
    // are we the last player?
    if (this.currentHandIndex === (this.hands.length-1)){
      this.dealersTurn()
      delete this.currentHandIndex

    // go to the next player
    }else{
      this.currentHandIndex++
    }
  }

  hitPlayer(player){
    if (!this.isPlayersTurn(player)){
      throw new Error('illegal move')
    }
    var hand = this.currentHand()
    hand.cards.push(this.game.deck.takeOne())

    if (hand.isBust()){
      this.endPlayersTurn()
    }

    this.game.onChange();
    return this;
  }

  stayPlayer(player){
    if (!this.isPlayersTurn(player)){
      throw new Error('illegal move')
    }
    this.endPlayersTurn()
    this.game.onChange();
    return this;
  }

  dealersTurn(){
    this.dealersHand.cards.push(this.game.deck.takeOne())
    // while(!this.dealersHand.isBust()){
    //   if (this.dealersHand.value() < 17){

    //   }
    // }

    this.endRound()
  }

  endRound(){
    this.isOver = true;
    var dealersBusted = this.dealersHand.isBust()
    var dealersHandValue = this.dealersHand.value()
    var winners = this.hands.filter(hand =>
      !hand.isBust() && (dealersBusted || hand.value() > dealersHandValue)
    )
    var loosers = this.hands.filter(hand =>
      hand.isBust() || (!dealersBusted && hand.value() < dealersHandValue)
    )
    var pushers = this.hands.filter(hand =>
      !dealersBusted && !hand.isBust() && hand.value() === dealersHandValue
    )

    if (winners.length + loosers.length + pushers.length > this.hands.length){
      throw new Error('end game calculation is bad')
    }
    winners.forEach(hand => {
      hand.result = 'win'
      hand.player.wallet += hand.bet * 2
      this.game.winnings -= hand.bet
    })
    loosers.forEach(hand => {
      hand.result = 'loss'
      this.game.winnings += hand.bet
    })
    pushers.forEach(hand => {
      hand.result = 'push'
      hand.player.wallet += hand.bet
    })
  }

  cleanup(){
    // put all the cards back in the deck
    this.hands.concat([this.dealersHand]).forEach(hand => {
      while (hand.cards.length > 0){
        this.game.deck.cards.push(hand.cards.shift())
      }
    })
    this.game.deck.shuffle()
  }
}
