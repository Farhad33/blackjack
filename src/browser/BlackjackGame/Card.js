export default class Card {
  constructor(rank, suit){
    this.rank = rank
    this.suit = suit
    this.value = Card.VALUES[this.rank]
  }
}

Card.SUITS = ['♠', '♦', '♣', '♥']
Card.RANKS = [
  'ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'king',
  'queen',
  'jack',
]
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
