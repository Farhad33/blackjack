import _ from 'lodash'
import Card from './Card'

// NOTE: Most games today use four, six, or eight decks.
export default class Deck {
  constructor(numberOfPlayer){
    if (typeof numberOfPlayer !== 'number') numberOfPlayer = 1;

    this.cards = [];
    do {
      Card.SUITS.forEach(suit => {
        Card.RANKS.forEach(rank => {
          this.cards.push(new Card(rank, suit))
        })
      })
      numberOfPlayer -= 2
    }while(numberOfPlayer > 0)

    this.shuffle()
  }

  shuffle(){
    this.cards = _.shuffle(this.cards)
    return this;
  }

  takeOne(){
    return this.cards.shift();
  }

  toState(){
    return {
      cards: this.cards.map(card => card.toState())
    }
  }

  static fromState(state){
    var deck = Object.create(this.prototype)
    deck.cards = state.cards.map(cardState => Card.fromState(cardState))
    return deck;
  }
}
