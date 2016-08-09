export default class Hand {
  constructor(options){
    this.cards = options.cards || [];
    this.bet = options.bet || 0;
  }
}