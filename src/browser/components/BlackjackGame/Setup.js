import _ from 'lodash'
import React, { Component } from 'react'

export default class Setup extends Component {
  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }

  constructor(){
    super()
    this.addHumanPlayer = this.addHumanPlayer.bind(this)
    this.addAiPlayer = this.addAiPlayer.bind(this)
  }

  addHumanPlayer(){
    this.props.emit({
      type: 'addHumanPlayer',
      name: generateRandomName(),
      wallet: 100,
    })
  }

  addAiPlayer(){
    this.props.emit({
      type: 'addAiPlayer',
      name: generateRandomName(),
      wallet: 100,
    })
  }

  removePlayer(playerId, event){
    event.preventDefault()
    this.props.emit({
      type: 'removePlayer',
      playerId: playerId,
    })
  }

  onNameChange(playerId, event){
    event.preventDefault()
    this.props.emit({
      type: 'updatePlayer',
      playerId: playerId, 
      updates: {name: event.target.value},
    })
  }
  onWalletChange(playerId, event){
    event.preventDefault()
    this.props.emit({
      type: 'updatePlayer',
      playerId: playerId, 
      updates: {wallet: event.target.value},
    })
  }

  onSubmit(event){
    event.preventDefault();
    this.props.emit({type: 'completeSetup'})
  }

  render(){
    const { game } = this.props

    const players = this.props.game.players.map((player, index) => {
      const id="BlackjackGame-setup-player-"+index
      return <li key={index}>
        <div className="BlackjackGame-setup-player">
          <label htmlFor={id} className="BlackjackGame-setup-player-title">
            <strong>{player.isAi ? 'Ai' : 'Human'} Player</strong>
          </label>
          <input id={id} type="text" value={player.name} onChange={this.onNameChange.bind(this, player.id)}/>
          <input type="number" value={player.wallet} onChange={this.onWalletChange.bind(this, player.id)}/>
          <button type="button" onClick={this.removePlayer.bind(this, player.id)} tabIndex="-1">X</button>
        </div>
      </li>
    })

    return <div className="BlackjackGame-setup">
      <form onSubmit={this.onSubmit.bind(this)}>
        <h1>Blackjack</h1>
        <div className="BlackjackGame-setup-buttons">
          <button type="button" onClick={this.addHumanPlayer}>Add Human Player</button>
          <button type="button" onClick={this.addAiPlayer}>Add Ai Player</button>
        </div>
        <h3>Players:</h3>
        <ol className="BlackjackGame-setup-players">
          <li>
            <div className="BlackjackGame-setup-player">
              <strong className="BlackjackGame-setup-name">Name</strong>
              <strong className="BlackjackGame-setup-wallet">Wallet</strong>
            </div>
          </li>
          {players}
        </ol>
        <div>
          <input type="submit" value="Play" />
        </div>
      </form>
    </div>
  }
}


const generateRandomName = function(){
  var names = [
    "Runny", "Buttercup", "Dinky", "Stinky", "Crusty",
    "Greasy","Gidget", "Cheesypoof", "Lumpy", "Wacky", "Tiny", "Flunky",
    "Fluffy", "Zippy", "Doofus", "Gobsmacked", "Slimy", "Grimy", "Salamander",
    "Oily", "Burrito", "Bumpy", "Loopy", "Snotty", "Irving", "Egbert",
    "Waffer", "Lilly","Rugrat","Sand", "Fuzzy","Kitty",
    "Puppy", "Snuggles","Rubber", "Stinky", "Lulu", "Lala", "Sparkle", "Glitter",
    "Silver", "Golden", "Rainbow", "Cloud", "Rain", "Stormy", "Wink", "Sugar",
    "Twinkle", "Star", "Halo", "Angel", "Snicker", "Buffalo", "Gross", "Bubble", "Sheep",
    "Corset", "Toilet", "Lizard", "Waffle", "Kumquat", "Burger", "Chimp", "Liver",
    "Gorilla", "Rhino", "Emu", "Pizza", "Toad", "Gerbil", "Pickle", "Tofu", 
    "Chicken", "Potato", "Hamster", "Lemur", "Vermin",
    "face", "dip", "nose", "brain", "head", "breath", 
    "pants", "shorts", "lips", "mouth", "muffin", "butt", "bottom", "elbow", 
    "honker", "toes", "buns", "spew", "kisser", "fanny", "squirt", "chunks", 
    "brains", "wit", "juice", "shower"
  ];

  return _.sampleSize(names, 2).join(' ')
}