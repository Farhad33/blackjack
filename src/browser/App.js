import React, { Component } from 'react';
import './App.sass';
import Card from './components/Card'

class App extends Component {
  constructor(){
    super()
    this.state = {
      cards: [
        {
          suit: "♠",
          rank: "5",
          faceDown: true,
        },
        {
          suit: "♥",
          rank: "ace",
          faceDown: true,
        },
        {
          suit: "♦",
          rank: "king",
          faceDown: true,
        },
        {
          suit: "♣",
          rank: "jack",
          faceDown: true,
        },
        {
          suit: "♠",
          rank: "5",
          faceDown: true,
        },
        {
          suit: "♥",
          rank: "ace",
          faceDown: true,
        },
        {
          suit: "♦",
          rank: "king",
          faceDown: true,
        },
        {
          suit: "♣",
          rank: "jack",
          faceDown: true,
        }
      ]
    }
  }

  flipCard(card, event){
    event.preventDefault();
    card.faceDown = !card.faceDown
    this.forceUpdate();
  }

  render() {
    const cards = this.state.cards.map((card, index) =>
      <Card
        key={index}
        suit={card.suit}
        rank={card.rank}
        faceDown={card.faceDown}
        onClick={this.flipCard.bind(this, card)}
      />
    )
    return (
      <div>
        {cards}
      </div>
    );
  }
}

export default App;
