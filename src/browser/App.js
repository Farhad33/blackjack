import React, { Component } from 'react';
import './App.sass';
import BlackjackGame from './BlackjackGame'
import BlackjackGameComponent from './components/BlackjackGame'

class App extends Component {

  constructor(){
    super()
    // DEBUGGING
    window.game = new BlackjackGame();
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
    return <BlackjackGameComponent game={this.state.game}/>
  }
}

export default App;
