import _ from 'lodash'
import Player from './Player'
import AiPlayer from './AiPlayer'
import Hand from './Hand'
import Deck from './Deck'
import Round from './Round'

export default class BlackjackGame {
  constructor(){
    // this.setup = false;
    // this.players = [];
    // this.prevRounds = [];
    // this.roundIndex = 0;
    // this.round = null; // current round
    // this.winnings = 0;
    this.loadState()
  }

  reset(){
    delete localStorage['BlackjackGame']
    this.constructor();
    if (this.onChange) this.onChange()
  }

  saveState(){
    var state = this.toState();
    console.log('state', state)
    localStorage['BlackjackGame'] = JSON.stringify(state)
  }

  toState(){
    var state = {}
    state.setup = this.setup
    state.players= this.players.map(player => player.toState())
    state.prevRounds = this.prevRounds.map(round => round.toState())
    state.roundIndex = this.roundIndex
    state.round = this.round ? this.round.toState() : null
    state.deck = this.deck ? this.deck.toState() : null
    state.winnings = this.winnings
    return state
  }

  loadState(){
    var state = localStorage['BlackjackGame']
    if (!state) return 
    state = JSON.parse(state)
    this.setup = state.setup
    this.players = state.players.map(playerState => {
      playerState.game = this
      return playerState.isAi ? AiPlayer.fromState(playerState) : Player.fromState(playerState)
    })
    this.prevRounds = state.prevRounds.map(roundState => { 
      roundState.game = this
      return Round.fromState(roundState) 
    })
    this.roundIndex = state.roundIndex
    if (state.round){
      state.round.game = this
      this.round = Round.fromState(state.round)
    }
    if (state.deck){
      this.deck = Deck.fromState(state.deck)
    }
    this.winnings = state.winnings
  }

  reportChange(){
    if (this.onChange) this.onChange();
    this.saveState();
  }

  addHumanPlayer(options){
    this.players.push(new Player({
      id:   this.players.length,
      game: this,
      name: options.name,
      wallet: options.wallet,
    }))
    this.reportChange()
    return this;
  }

  addAiPlayer(options){
    this.players.push(new AiPlayer({
      id:   this.players.length,
      game: this,
      name: options.name,
      wallet: options.wallet,
    }))
    this.reportChange()
    return this;
  }

  removePlayer(index){
    this.players.splice(index, 1)
    this.reportChange()
    return this;
  }

  updatePlayer(index, updates){
    var player = this.players[index]
    Object.assign(player, updates)
    this.reportChange()
    return this;
  }

  completeSetup(){
    this.setup = true;
    this.deck = new Deck(this.players.length)
    this.round = new Round({game: this})
    this.reportChange()
    return this;
  }

  playAnotherRound(){
    if (!this.round.isOver) return this;
    this.round.cleanup()
    this.prevRounds.push(this.round)
    this.round = new Round({game: this})
    this.reportChange()
    return this;
  }

  playersWithMoney(){
    return this.players.filter( player => player.wallet > 0)
  }
}
