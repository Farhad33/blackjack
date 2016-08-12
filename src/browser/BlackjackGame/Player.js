export default class Player {
  constructor(options){
    this.id = options.id
    this.game = options.game
    this.name = options.name
    this.wallet = options.wallet // in dollars
    this.isAi = false
  }

  toState(){
    return {
      id:     this.id,
      name:   this.name,  
      wallet: this.wallet,    
      isAi:   this.isAi,
    }
  }

  static fromState(state){
    var player = Object.create(this.prototype)
    player.id     = state.id
    player.game   = state.game
    player.name   = state.name
    player.wallet = state.wallet
    player.isAi   = state.isAi
    return player
  }
}
