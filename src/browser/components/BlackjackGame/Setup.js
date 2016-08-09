import React, { Component } from 'react'

export default class Setup extends Component {
  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }

  constructor(){
    super()
    this.addPlayer = this.addPlayer.bind(this)
  }

  onNameChange(nameIndex, event){
    event.preventDefault()
    let { game } = this.props
    game.playerNames.splice(nameIndex, 1, event.target.value)
    game.setPlayerNames(game.playerNames)
  }

  addPlayer(event){
    event.preventDefault();
    let { game } = this.props
    game.setPlayerNames(game.playerNames.concat(''))
  }

  removePlayer(nameIndex, event){
    event.preventDefault()
    let { game } = this.props
    game.playerNames.splice(nameIndex, 1)
    game.setPlayerNames(game.playerNames)
  }

  onSubmit(event){
    event.preventDefault();
    const { game } = this.props
    game.completeSetup()
  }

  render(){
    const { game } = this.props

    const playerNameInputs = this.props.game.playerNames.map((name, index) => {
      return <div key={index}>
        <label>
          <strong>Player #{index}</strong>
          <input type="text" value={name} onChange={this.onNameChange.bind(this, index)}/>
          <button type="button" onClick={this.removePlayer.bind(this, index)} tabIndex="-1">X</button>
        </label>
      </div>
    })

    return <form onSubmit={this.onSubmit.bind(this)}>
      <div>
        <button type="button" onClick={this.addPlayer}>Add Player</button>
      </div>
      {playerNameInputs}
      <div>
        <input type="submit" value="Play" />
      </div>
    </form>
  }
}