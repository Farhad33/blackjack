export default class Card {
  constructor(rank, suit){
    this.rank = rank
    this.suit = suit
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
