import React, { Component } from 'react'
import Card from './Card'

export default class BlackjackGame extends Component {
  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }

  render() {

    const { game } = this.props

    if (!game.setup){
       return (
        <div className="BlackjackGame">
          <h1>BlackjackGame</h1>
          <Setup game={game} />
          <pre>{JSON.stringify(this.props.game, null, 4)}</pre>
        </div>
      );     
    }else{
      return (
        <div className="BlackjackGame">
          <h1>BlackjackGame</h1>
          <h3>Lets play!</h3>
          <pre>{JSON.stringify(this.props.game, null, 4)}</pre>
        </div>
      );
    }
  }
}



class Setup extends Component {
  static propTypes = {
    game: React.PropTypes.object.isRequired,
  }

  onChange(gameProperty, event){
    const { game } = this.props
    game[gameProperty](event.target.value)
    console.log(game)
  }

  onSubmit(event){
    event.preventDefault();
    const { game } = this.props
    game.completeSetup()
  }

  render(){
    const { game } = this.props
    return <form onSubmit={this.onSubmit.bind(this)}>
      <label>
        <h4>How many human players?</h4>
        <input type="number" min="0" value={game.numberOfHumanPlayers} onChange={this.onChange.bind(this, 'setNumberOfHumanPlayers')}/>
      </label>
      <label>
        <h4>How many AI players?</h4>
        <input type="number" min="0" value={game.numberOfAiPlayers} onChange={this.onChange.bind(this, 'setNumberOfAiPlayers')}/>
      </label>
      <div>
        <button type="submit">Play</button>
      </div>
    </form>
  }
}
