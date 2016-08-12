import Player from './Player'

export default class AiPlayer extends Player {
  constructor(options){
    super(options)
    this.isAi = true
  }

  getBet(){
    return Math.round(this.wallet / 2)
  }

  takeActionsForHand(round, hand){
    this.dealersHand
    if (hand.value() <= 16){
      round.hitHand(hand)
    }else{
      round.stayHand(hand)
    }
  }
}
