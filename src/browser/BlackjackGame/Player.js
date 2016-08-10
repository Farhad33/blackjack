export default class Player {
  constructor(options){
    this.game = options.game
    this.name = options.name
    this.wallet = options.wallet // in dollars
    this.hands = []
  }
}
