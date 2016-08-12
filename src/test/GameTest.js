import expect from 'expect.js'
import sinon from 'sinon'
import game from 'browser/Game'

describe.only('game', ()=>{
  it('should be an object', ()=>{
    expect(game).to.be.a(Object)
  })
  
  it('should have initial state', ()=>{
    expect(game.state).to.be.a(Object)
  })

  it('should have a serializable state', ()=>{
    expect(JSON.parse(JSON.stringify(game.state))).to.eql(game.state)
  })

  it('should do what I want', ()=>{
    game.emit({type: 'reset'})
    expect(game.state).to.eql({
      setup:      false,
      players:    [],
      prevRounds: [],
      winnings:   0,
    })
    
    game.emit({
      type: 'addHumanPlayer',
      name: 'Jared Grippe',
      wallet: 134,
    })
    
    game.emit({
      type: 'addAiPlayer',
      name: 'R2D2',
      wallet: 845,
    })

    expect(game.state.players).to.eql([
      {
        id: 0,
        isAi: false,
        name: 'Jared Grippe',
        wallet: 134,  
      },
      {
        id: 1,
        isAi: true,
        name: 'R2D2',
        wallet: 845,  
      }
    ])
    
    game.emit({
      type: 'removePlayer',
      playerId: 1,
    })

    expect(game.state.players).to.eql([
      {
        id: 0,
        isAi: false,
        name: 'Jared Grippe',
        wallet: 134,  
      }
    ])

    game.emit({
      type: 'addHumanPlayer',
      name: 'Majid',
      wallet: 245,
    })
    
    game.emit({
      type: 'addHumanPlayer',
      name: 'Devan',
      wallet: 369,
    })

    expect(game.state.players.length).to.eql(3)

    game.emit({
      type: 'updatePlayer',
      playerId: 2, 
      updates: {
        name: 'Devon',
        wallet: 375
      }
    })

    expect(game.state.players[2].name).to.eql('Devon')
    expect(game.state.players[2].wallet).to.eql(375)

    game.emit({type: 'completeSetup'})

    expect(game.state.setup).to.be(true)
    expect(game.state.deck.length).to.be(104)

    // TODO expect the deck to be shuffled
    // console.log(game.state.deck);

    expect(game.state.round).to.eql({
      dealersHand: {
        cards: [],
        value: 0,
        isBust: false,
      },
      hands: [],
      playersOutThisRound: [],
      playersWhoHaveBet: [],
    })


    // jared bets
    game.emit({
      type: 'setBetForPlayer',
      playerId: 0,
      bet: 20,
    })
    expect(game.state.players[0].wallet).to.eql(114)
    expect(game.state.round.hands).to.eql([
      {
        id: 0,
        playerId: 0,
        bet: 20,
        cards: [],
        isbust: false,
        value: 0,
      }
    ])
    expect(game.state.round.playersWhoHaveBet).to.eql([0])

    // Majid betting
    game.emit({
      type: 'setBetForPlayer',
      playerId: 1,
      bet: 122,
    })
    expect(game.state.players[1].wallet).to.eql(123)
    expect(game.state.round.hands.length).to.eql(2)
    expect(game.state.round.hands[1]).to.eql({
      id: 1,
      playerId: 1,
      bet: 122,
      cards: [],
      isbust: false,
      value: 0,
    })
    expect(game.state.round.playersWhoHaveBet).to.eql([0,1])

    // Devon betting
    game.emit({
      type: 'setBetForPlayer',
      playerId: 2,
      bet: 75,
    })
    expect(game.state.players.length         ).to.eql(3)
    expect(game.state.players[2].wallet      ).to.eql(300)
    expect(game.state.round.hands[2].id      ).to.eql(2)
    expect(game.state.round.hands[2].playerId).to.eql(2)
    expect(game.state.round.hands[2].bet     ).to.eql(75)
    expect(game.state.round.playersWhoHaveBet).to.eql([0,1,2])

    const walletAmountsAfterBetting = game.state.players.map(player => player.wallet)

    // expect cards to have been dealt
    expect(game.state.round.dealersHand.cards.length).to.eql(2)
    expect(game.state.round.hands[0].cards.length).to.eql(2)
    expect(game.state.round.hands[1].cards.length).to.eql(2)
    expect(game.state.round.hands[2].cards.length).to.eql(2)
    expect(game.state.round.dealersHand.value).to.be.greaterThan(0)
    expect(game.state.round.hands[0].value).to.be.greaterThan(0)
    expect(game.state.round.hands[1].value).to.be.greaterThan(0)
    expect(game.state.round.hands[2].value).to.be.greaterThan(0)
    expect(game.state.round.dealersHand.isBust).to.be(false)
    expect(game.state.round.hands[0].isBust).to.be(false)
    expect(game.state.round.hands[1].isBust).to.be(false)
    expect(game.state.round.hands[2].isBust).to.be(false)

    expect(game.state.round.actionHandIndex).to.eql(0)

    // game throws when the wrong hand (player) tries to go out of order
    expect(()=>{
      game.emit({
        type: 'hitHand',
        handId: 2,
      })
    }).to.throwException()


    game.emit({
      type: 'hitHand',
      handId: 0,
    })

    expect(game.state.round.hands[0].cards.length).to.eql(3)

    if (!game.state.round.hands[0].isBust){
      game.emit({
        type: 'stayHand',
        handId: 0,
      })
    }

    expect(game.state.round.actionHandIndex).to.eql(1)

    do {
      game.emit({
        type: 'hitHand',
        handId: 1,
      })
    }while(!game.state.round.hands[1].isBust)

    expect(game.state.round.hands[1].cards.length).to.be.greaterThan(2)
    expect(game.state.round.hands[1].value).to.be.greaterThan(21)
    expect(game.state.round.actionHandIndex).to.eql(2)


    game.emit({
      type: 'hitHand',
      handId: 2,
    })
    expect(game.state.round.hands[2].cards.length).to.eql(3)

    if (!game.state.round.hands[2].isBust){
      game.emit({
        type: 'stayHand',
        handId: 2,
      })
    }

    expect('actionHandIndex' in game.state.round).to.be(false)

    // dealers turn


    // end game
    expect(game.state.round.isOver).to.be(true)




    let expectedWinnings = 0
    game.state.round.hands.forEach(hand => {
      var player = game.findPlayer(hand.playerId)
      var walletAmountAfterBetting = walletAmountsAfterBetting[hand.playerId]
      if (hand.result === 'win'){
        expect(player.wallet).to.eql(walletAmountAfterBetting + (hand.bet * 2))
        expectedWinnings -= hand.bet

      }else if (hand.result === 'loss'){
        expect(player.wallet).to.eql(walletAmountAfterBetting)
        expectedWinnings += hand.bet

      }else if (hand.result === 'push'){
        expect(player.wallet).to.eql(walletAmountAfterBetting + hand.bet)
      }
    })

    expect(game.state.winnings).to.eql(expectedWinnings)


    game.emit({type: 'playAnotherRound'})

    expect(game.state.prevRounds.length).to.eql(1)
    expect(game.state.round).to.eql({
      dealersHand: {
        cards: [],
        value: 0,
        isBust: false,
      },
      hands: [],
      playersOutThisRound: [],
      playersWhoHaveBet: [],
    })


  })

  // it('should do what I want', ()=>{
  //   game.state = {

  //   }
  // })
})