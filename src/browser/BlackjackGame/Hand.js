export default class Hand {
  constructor(options){
    this.player = options.player;
    this.cards = options.cards || [];
    this.bet = options.bet || null;
  }
}
