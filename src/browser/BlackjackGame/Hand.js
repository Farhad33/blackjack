export default class Hand {
  constructor(options){
    this.player = options.player;
    this.cards = options.cards || [];
    this.bet = options.bet || null;
  }

  value(){
    return Hand.value(this.cards)
  }

  isBust(){
    return this.value() > 21
  }
}



Hand.value = function(cards){
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
