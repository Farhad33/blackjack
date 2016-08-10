import _ from 'lodash'
import Card from './Card'

// NOTE: Most games today use four, six, or eight decks.
export default class Deck {
  constructor(){
    this.cards = [];

    Card.SUITS.forEach(suit => {
      Card.RANKS.forEach(rank => {
        this.cards.push(new Card(rank, suit))
      })
    })

    _.shuffle(this.cards)
  }

  takeOne(){
    return this.cards.shift();
  }
}
