import Card from './Card'

export default class Hand {
  constructor(options){
    this.player = options.player;
    this.cards = options.cards || [];
    this.bet = options.bet || null;
  }

  value(){
    return Hand.cardsValue(this.cards)
  }

  isSoft(){
    !!this.cards.find(hand => hand.isAce())
  }

  isBust(){
    return this.value() > 21
  }

  toState(){
    return {
      playerId: this.player ? this.player.id : null,
      cards: this.cards.map(card => card.toState()),
      bet: this.bet,
      result: this.result,
    }
  }

  static fromState(state){
    var hand = Object.create(this.prototype)
    if ('playerId' in state){
      hand.player = state.game.players.find(player => state.playerId === player.id)
    }
    hand.cards = state.cards.map(cardState => Card.fromState(cardState))
    hand.bet = state.bet 
    hand.result = state.result 
    return hand
  }
}



Hand.cardsValue = function(cards){
  var total = 0

  var numberOfAces = cards.filter(card => card.isAce()).length

  cards.forEach(card => {
    total += card.value
  })

  while (total > 21 && numberOfAces > 0) {
    total -= 10
    numberOfAces -= 1
  }

  return total;
}
