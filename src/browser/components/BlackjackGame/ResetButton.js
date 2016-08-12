import React, { Component } from 'react'

export default class ResetButton extends Component {
  constructor(){
    super()
    this.resetGame = this.resetGame.bind(this)
  }
  resetGame(event){
    event.preventDefault()
    this.props.emit({type: 'reset'})
  }
  render(){
    return <button {...this.props} onClick={this.resetGame}>reset</button>
  }
}