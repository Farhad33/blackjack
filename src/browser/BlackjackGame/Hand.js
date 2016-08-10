export default class Hand {
  constructor(options){
    this.player = options.player;
    this.cards = options.cards || [];
    this.bet = options.bet || null;
  }

  value(){
    var total = 0
    this.cards.forEach(card => {
      total += card.value
    })
    return total;
  }

  isBust(){

  }
}
