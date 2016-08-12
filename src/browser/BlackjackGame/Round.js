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
    this.outPlayerIds = this.game.players.filter(player => player.wallet <= 0).map(player => player.id)
    this.hands = []
    this.currentHandIndex = null;


    this.aiPlayers().forEach(aiPlayer => {
      this.setPlayerBet(aiPlayer, aiPlayer.getBet())
    })

    // collects bets AKA who is in the round
    // deal two cards to each Hand
    // let each player take actions her hand
    // complete
  }

  toState(){
    var state = {}
    state.isOver           = this.isOver;
    state.dealersHand      = this.dealersHand.toState();
    state.outPlayerIds     = this.outPlayerIds;
    state.hands            = this.hands.map(hand => hand.toState())
    state.currentHandIndex = this.currentHandIndex;
    return state;
  }

  static fromState(state){
    state.dealersHand.game = state.game
    
    var round = Object.create(this.prototype);
    round.game             = state.game
    round.isOver           = state.isOver
    round.dealersHand      = Hand.fromState(state.dealersHand)
    round.outPlayerIds     = state.outPlayerIds
    round.hands            = state.hands.map(handState => {
      handState.game = state.game
      return Hand.fromState(handState)
    })
    round.currentHandIndex = state.currentHandIndex
    return round;
  }

  aiPlayers(){
    return this.game.players.filter(player => player.isAi)
  }

  humanPlayers(){
    return this.game.players.filter(player => !player.isAi)
  }

  playerIsOut(player){
    return this.outPlayerIds.includes(player.id)
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
      this.outPlayerIds.push(player.id)
    }

    if (this.allPlayersHaveBet()){
      this.hands = _.sortBy(this.hands, hand => this.game.players.indexOf(hand.player));
      this.dealTwoCardsToEachHand()
      this.nextHandsTurn()
    }

    this.game.reportChange()
    return this;
  }

  playerHasBet(player){
    return (
      this.outPlayerIds.includes(player.id) ||
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
    return this.hands[this.currentHandIndex]
  }

  isHandsTurn(hand){
    return this.currentHand() === hand
  }

  nextHandsTurn(){
    // first hands turn
    if (this.currentHandIndex === null){
      this.currentHandIndex = 0
    
    // last hand just finished its turn
    }else if (this.currentHandIndex === (this.hands.length-1)){
      this.dealersTurn()
      this.endRound()
      delete this.currentHandIndex

    // go to the next hand
    }else{
      this.currentHandIndex++
    }

    var currentHand = this.currentHand()
    if (currentHand && currentHand.player.isAi){
      while(this.isHandsTurn(currentHand)){
        currentHand.player.takeActionsForHand(this, currentHand)
      }
    }
  }

  hitHand(hand){
    if (!this.isHandsTurn(hand)){
      throw new Error('illegal move')
    }
    var hand = this.currentHand()
    hand.cards.push(this.game.deck.takeOne())

    if (hand.isBust()){
      this.nextHandsTurn()
    }

    this.game.reportChange();
    return this;
  }

  stayHand(hand){
    if (!this.isHandsTurn(hand)){
      throw new Error('illegal move')
    }
    this.nextHandsTurn()
    this.game.reportChange();
    return this;
  }

  dealersTurn(){
    var activeHands = this.hands.filter(hand => !hand.isBust())
    if (activeHands.length === 0) return; // all players busted, do nothing
    var biggestBetHand = _.sortBy(activeHands, hand => hand.bet).reverse()[0]
    var minOponentValue = Hand.cardsValue(biggestBetHand.cards.slice(1)) + 1
      // .map(hand => Hand.cardsValue(hand.cards.slice(1)) + 1)
      // .sort().reverse()[0]

    if (minOponentValue < 14) minOponentValue = 14

    console.log('Dealer Logic', {
      biggestBetHand: biggestBetHand,
      minOponentValue: minOponentValue,
      HandValue: this.dealersHand.value()
    })

    while(!this.dealersHand.isBust()){
      if (
        (this.dealersHand.value() < minOponentValue) ||
        ((biggestBetHand.cards.length === 2) && (minOponentValue >= 10) && (this.dealersHand.value() < 17))
      ){
        // hit
        this.dealersHand.cards.push(this.game.deck.takeOne())
      }
      else{
        // Staying
        return
      }
    }
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
