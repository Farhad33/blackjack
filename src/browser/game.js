const locaStorageKey = 'BlackjackGame'

const store = (typeof localStorage === 'undefined') ? {} : localStorage;

const getInitialState = function(){
  var state = store[locaStorageKey]
  return state ? JSON.parse(state) : {
    setup:      false,
    players:    [],
    prevRounds: [],
    rounds:     [],
    winnings:   0,
  }
}

const game = {
  state: getInitialState(),
  
  emit(event){
    console.log('EVENT', event, game)

    if (event.type in ACTIONS){
      ACTIONS[event.type](event)
    }else{
      throw Error('unknown event type: '+event.type)
    }
    store[locaStorageKey] = JSON.stringify(game.state)
    if (game.onChange) game.onChange()
  }
}

const ACTIONS = {
  addHumanPlayer({name, wallet}){
    game.state.players.push({
      id: game.state.players.length,
      isAi: false,
      name: name,
      wallet: wallet,
    })
  },

  addAiPlayer({name, wallet}){
    game.state.players.push({
      id: game.state.players.length,
      isAi: true,
      name: name,
      wallet: wallet,
    })
  },

  removePlayer({playerIndex}){
    game.state.players.splice(playerIndex, 1)
  },

  updatePlayer({playerIndex, updates}){
    Object.assign(game.state.players[playerIndex], updates)
  },

  completeSetup(){
    game.state.setup = true
    game.state.deck = createDeck(game.state.players.length)
    game.state.round = {
      dealersHand: {
        cards: [],
        value: 0,
        isBust: false,
      },
      hands: [],
      playersOutThisRound: [],
      playersWhoHaveBet: [],
    }
  },

  setBetForPlayer({bet, playerId}){
    if (bet > 0){
      var player = game.state.players.find(player => player.id === playerId)
      if (bet > player.wallet) return;
      player.wallet -= bet
      game.state.round.hands.push({
        id: game.state.round.hands.length,
        playerId: playerId,
        bet: bet,
        cards: [],
        isbust: false,
        value: 0,
      })
    }else{
      game.state.round.playersOutThisRound.push(playerId)
    }
    game.state.round.playersWhoHaveBet.push(playerId)

    if (game.state.round.playersWhoHaveBet.length === game.state.players.length){
      dealCards()
      game.state.round.actionHandId = game.state.round.hands[0].id
    }
  },

  hitHand({handId}){
    var card = game.state.deck.shift()
    var hand = game.state.round.hands[handId]
    addCardToHand(hand, card)
  },

  stayHand({handId}){
    game.state.round.actionHandId++
    if (game.state.round.actionHandId >= game.state.round.hands.length){
      delete game.state.round.actionHandId
    }
  }
}


const dealCards = function(){
  const { hands, dealersHand } = game.state.round
  const { deck } = game.state
  _.times(2, ()=> {
    hands.forEach(hand => {
      addCardToHand(hand, deck.shift())
    })
    addCardToHand(dealersHand, deck.shift())
  });
}

const addCardToHand = function(hand, card){
  hand.cards.push(card)
  hand.value = valueForCards(hand.cards) 
  hand.isBust = hand.value > 21
}

const SUITS = ['♠', '♦', '♣', '♥']
const CARD_VALUES = {
  'A': 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10,
}
const RANKS = Object.keys(CARD_VALUES)


const createDeck = function(numberOfPlayer){
  var cards = []
  do {
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        cards.push({
          rank: rank, 
          suit: suit,
          value: CARD_VALUES[rank]
        })
      })
    })
    numberOfPlayer -= 2
  }while(numberOfPlayer > 0)
  return cards 
}


const valueForCards = function(cards){
  var value = 0

  var numberOfAces = cards.filter(card => card.rank === 'A').length

  cards.forEach(card => {
    value += card.value
  })

  while (value > 21 && numberOfAces > 0) {
    value -= 10
    numberOfAces -= 1
  }

  return value;
}

export default game