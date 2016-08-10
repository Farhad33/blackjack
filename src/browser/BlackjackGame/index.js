import _ from 'lodash'
import Player from './Player'
import Hand from './Hand'
import Deck from './Deck'
import Round from './Round'

export default class BlackjackGame {
  constructor(){
    this.setup = false;
    this.players = [];
    this.roundIndex = 0;
    this.round = null; // current round
    // // TEMP HACK TO SKIP SETUP
    // this.setup = true;
    // this.addPlayer({name: 'Jared', wallet: 120})
    // this.addPlayer({name: 'Majid', wallet: 200})
    // this.addPlayer({name: 'Devon', wallet: 130})
  }

  // set this function to get called back when this object changes
  onChange(){ /* intentionally left blank */ }

  addPlayer(options){
    this.players.push(new Player({
      game: this,
      name: options.name,
      wallet: options.wallet,
    }))
    this.onChange()
    return this;
  }

  removePlayer(index){
    this.players.splice(index, 1)
    this.onChange()
    return this;
  }

  updatePlayer(index, updates){
    var player = this.players[index]
    Object.assign(player, updates)
    this.onChange()
    return this;
  }

  completeSetup(){
    this.setup = true;

    // TODO increase the size of the deck based on players.length
    this.deck = new Deck;
    this.round = new Round({game: this})
    this.onChange()
    return this;
  }
}
