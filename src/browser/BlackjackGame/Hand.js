export default class Hand {
  constructor(options){
    this.player = options.player;
    this.cards = options.cards || [];
    this.bet = options.bet || null;
  }

  value(){
    var total = 0

    var numberOfAces = this.cards.filter(card => card.isAce()).length

    this.cards.forEach(card => {
      total += card.value
    })

    while (total > 21 && numberOfAces > 0) {
      total -= 10
      numberOfAces -= 1
    }

    return total;
  }

  isBust(){
    return this.value() > 21
  }
}
