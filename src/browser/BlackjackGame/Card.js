export default class Card {
  constructor(rank, suit){
    this.rank = rank
    this.suit = suit
    this.value = Card.VALUES[this.rank]
  }

  isAce(){
    return this.rank === 'A'
  }

  toState(){
    return {
      rank: this.rank,
      suit: this.suit,
      value: this.value,
    }
  }

  static fromState(state){
    var card = Object.create(this.prototype)
    card.rank = state.rank
    card.suit = state.suit
    card.value = state.value
    return card
  }
}

Card.SUITS = ['♠', '♦', '♣', '♥']
Card.VALUES = {
  'A': 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10,
}
Card.RANKS = Object.keys(Card.VALUES)
