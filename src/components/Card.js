import React, { Component } from 'react';
import './Card.css';
import cardback from '../images/cardback.png';
import cardImages from '../images/cards';



class Card extends Component {
  static propTypes = {
    suit: React.PropTypes.string.isRequired,
    rank: React.PropTypes.string.isRequired,
    faceDown: React.PropTypes.bool
  }
  
  static defaultProps = {
    faceDown: false
  }

  render() {
    let className = "Card "+(this.props.faceDown ? 'Card-facedown' : 'Card-faceup')
    const key = `${this.props.rank}${this.props.suit}`
    console.log(Object.keys(cardImages))
    return (
      <div className={className}>
      	<div className="Card-flipper">
      		<div className="Card-front">
      			<img src={cardImages[key]} alt={key}/>
      		</div>
      		<div className="Card-back">
            <img src={cardback} alt="cardback"/>
      		</div>
      	</div>
      </div>
    );
  }
}

export default Card;
