import React, { Component } from 'react';
import './App.sass';
import BlackjackGame from './BlackjackGame'
import BlackjackGameComponent from './components/BlackjackGame'

class App extends Component {

  constructor(){
    super()
    this.state = {
      game: new BlackjackGame(this.onGameChange.bind(this)),
    }
  }

  onGameChange(){
    this.forceUpdate();
  }

  render() {
    return <BlackjackGameComponent game={this.state.game}/>
  }
}

export default App;
