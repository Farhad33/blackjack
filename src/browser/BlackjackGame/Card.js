export default class Card {
  constructor(rank, suit){
    this.rank = rank
    this.suit = suit
    this.value = Card.VALUES[this.rank]
  }

  isAce(){
    return this.rank === 'ace'
  }
}

Card.SUITS = ['♠', '♦', '♣', '♥']
Card.VALUES = {
  'ace': 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'king': 10,
  'queen': 10,
  'jack': 10,
}
Card.RANKS = Object.keys(Card.VALUES)
