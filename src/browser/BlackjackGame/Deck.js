import Card from './Card'

export default class Deck {
  constructor(){
    this.cards = [];

    Card.SUITS.forEach(suit => {
      Card.RANKS.forEach(rank => {
        this.cards.push(new Card(suit, rank))
      })
    })
  }
}