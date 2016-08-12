import React, { Component } from 'react';
import './App.sass';
import game from './game'
import BlackjackGameComponent from './components/BlackjackGame'

class App extends Component {

  constructor(){
    super()
    // DEBUGGING
    window.game = game
    this.state = {
      game: game
    }
  }

  componentDidMount(){
    this.state.game.onChange = this.onGameChange.bind(this)
  }

  onGameChange(){
    this.forceUpdate();
  }

  render() {
    return <BlackjackGameComponent 
      game={this.state.game.state}
      emit={game.emit}
    />
  }
}

export default App;
