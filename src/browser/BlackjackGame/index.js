import _ from 'lodash'
import Player from './Player'
import Hand from './Hand'

export default class BlackjackGame {
  constructor(onChange){
    this.onChange = onChange;
    this.setup = false;
    this.playerNames = [];
  }

  setPlayerNames(playerNames){
    this.playerNames = playerNames
    this.onChange()
    return this;
  }

  completeSetup(){
    this.setup = true;
    this.players = this.playerNames.map(name =>
      new Player({
        name: name,
        hands: [new Hand]
      })
    )
    delete this.playerNames;

    this.players.forEach(player => {
      player.hands[0].cards.push()
    })

    this.onChange()
    return this;
  }
}