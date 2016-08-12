import _ from 'lodash'

const locaStorageKey = 'BlackjackGame'

const store = (typeof localStorage === 'undefined') ? {} : localStorage;

const defaultState = function(){
  return  {
    setup:      false,
    players:    [],
    playersWhoHaveMoneyLeft: [],
    prevRounds: [],
    winnings:   0,
  }
}

const getInitialState = function(){
  var state = store[locaStorageKey]
  return state ? JSON.parse(state) : defaultState()
}

const game = {
  state: getInitialState(),
  
  emit(event){
    console.info('EVENT', event.type, event)
    if (event.type in ACTIONS){
      ACTIONS[event.type](event)
    }else{
      throw Error('unknown event type: '+event.type)
    }
    store[locaStorageKey] = JSON.stringify(game.state)
    if (game.onChange) game.onChange()
  },

  // reading state helpers (READ ONLY)
  findPlayer: function(playerId){
    return game.state.players.find(player => player.id === playerId)
  },
  findHand: function(handId){
    return game.state.round.hands.find(hand => hand.id === handId)
  }
}

const ACTIONS = {
  reset(){
    game.state = defaultState()
  },

  addHumanPlayer({name, wallet}){
    const player = {
      id: game.state.players.length,
      isAi: false,
      name: name,
      wallet: wallet,
    }
    game.state.players.push(player)
    if (player.wallet > 0){
      game.state.playersWhoHaveMoneyLeft.push(player.id)
    }
  },

  addAiPlayer({name, wallet}){
    const player = {
      id: game.state.players.length,
      isAi: true,
      name: name,
      wallet: wallet,
    }
    game.state.players.push(player)
    if (player.wallet > 0){
      game.state.playersWhoHaveMoneyLeft.push(player.id)
    }
  },

  removePlayer({playerId}){
    game.state.players.splice(playerId, 1)
  },

  updatePlayer({playerId, updates}){
    Object.assign(game.findPlayer(playerId), updates)
  },

  completeSetup(){
    game.state.setup = true
    game.state.deck = createDeck(game.state.players.length)
    shuffleDeck()
    startNewRound()
  },

  setBetForPlayer({playerId, bet}){
    const { round } = game.state
    const { hands } = round
    if (bet > 0){
      var player = game.findPlayer(playerId)
      if (bet > player.wallet) return;
      player.wallet -= bet
      hands.push({
        id: round.hands.length,
        playerId: playerId,
        bet: bet,
        cards: [],
        isbust: false,
        value: 0,
        isAi: player.isAi,
      })
    }else{
      round.players.splice(round.players.indexOf(playerId), 1)
    }
    round.playersWhoHaveBet.push(playerId)

    if (round.playersWhoHaveBet.length - round.players.length === 0){
      round.hands = _.sortBy(hands, 'playerId');
      dealCards()
      nextHand()
    }
  },

  hitHand({handId}){
    raiseIfNotActionHand(handId)
    var hand = game.findHand(handId)
    addCardToHand(hand)
    if (hand.isBust) nextHand()
  },

  stayHand({handId}){
    raiseIfNotActionHand(handId)
    nextHand()
  },

  playAnotherRound(){
    if (!game.state.round.isOver) throw new Error('round not over yet. refusing to start new round')
    putAllCardsBackInDeck()
    startNewRound()
  }
}




// PRIVATE helpers
const raiseIfNotActionHand = function(handId){
  var actionHand = game.state.round.hands[game.state.round.actionHandIndex]
  if (actionHand.id !== handId) throw new Error('not your turn');
}

const startNewRound = function(){
  if (game.state.round){
    game.state.prevRounds.push(game.state.round)
  }
  if (game.state.playersWhoHaveMoneyLeft.length > 0){
    game.state.round = {
      dealersHand: {
        cards: [],
        value: 0,
        isBust: false,
      },
      hands: [],
      // playersOutThisRound: playersOutThisRound,
      players: game.state.playersWhoHaveMoneyLeft,
      playersWhoHaveBet: [],
    }
    makeBetsForAiPlayers()
  }else{
    delete game.state.round
  }
}

const nextHand = function(){
  if (!('actionHandIndex' in game.state.round)){
    game.state.round.actionHandIndex = 0
  }else{
    game.state.round.actionHandIndex++
  }
  const actionHand = game.state.round.hands[game.state.round.actionHandIndex]
  if (actionHand){
    game.state.round.actionHandId = actionHand.id
    if (actionHand.isAi) aiPlayersTurn(actionHand)
  }else{
    delete game.state.round.actionHandIndex
    delete game.state.round.actionHandId
    dealersTurn()
  }
}

const makeBetsForAiPlayers = function(){
  game.state.round.players.forEach(playerId => {
    const player = game.findPlayer(playerId)
    if (!player.isAi) return;
    game.emit({
      type: 'setBetForPlayer',
      playerId: playerId,
      bet: Math.round(player.wallet/2),
    })
  })
}

const aiPlayersTurn = function(hand){
  const player = game.findPlayer(hand.playerId)
  while (!hand.isBust && hand.value <= 16){
    game.emit({
      type: 'hitHand',
      handId: hand.id,
    })
  }
  if (!hand.isBust){
    game.emit({
      type: 'stayHand',
      handId: hand.id,
    })
  }
}

const dealersTurn = function(){
  addCardToHand(game.state.round.dealersHand)
  endRound()
}

const endRound = function(){
  const { round } = game.state
  const { dealersHand } = round
  
  round.isOver = true;

  round.hands.forEach(hand => {
    const player = game.findPlayer(hand.playerId)
    // winner
    if (!hand.isBust && (dealersHand.isBust || hand.value > dealersHand.value)){
      hand.result = 'win'
      player.wallet += hand.bet * 2
      game.state.winnings -= hand.bet
    }
    // loser
    else if (hand.isBust || (!dealersHand.isBust && hand.value < dealersHand.value)){
      hand.result = 'loss'
      game.state.winnings += hand.bet 
    }
    // pusher
    else if (!dealersHand.isBust && !hand.isBust && hand.value === dealersHand.value){
      hand.result = 'push'
      player.wallet += hand.bet
    }else{
      throw new Error('unknown hand state '+hand)
    }
  })

  game.state.playersWhoHaveMoneyLeft = game.state.players
    .filter(player => player.wallet > 0)
    .map(player => player.id)

  if (game.state.players.every(player => player.isAi)){
    game.emit({type:'playAnotherRound'})
  }
}

const dealCards = function(){
  const { hands, dealersHand } = game.state.round
  _.times(2, ()=> {
    hands.forEach(hand => {
      addCardToHand(hand)
    })
    addCardToHand(dealersHand)
  });
}

const addCardToHand = function(hand){
  hand.cards.push(game.state.deck.shift())
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

const shuffleDeck = function(){
  game.state.deck = _.shuffle(game.state.deck)
}

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

const putAllCardsBackInDeck = function(){
  game.state.round.hands.concat([game.state.round.dealersHand]).forEach(hand => {
    while (hand.cards.length > 0){
      game.state.deck.push(hand.cards.shift())
    }
  })
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