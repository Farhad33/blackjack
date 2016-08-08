import expect from 'expect.js'
import sinon from 'sinon'
import BlackjackGame from 'browser/BlackjackGame'

describe('BlackjackGame', ()=>{
  it('should be a class', ()=>{
    expect(BlackjackGame).to.be.a('function')
    var game = new BlackjackGame
    expect(game).to.be.a(BlackjackGame)
    expect(game.setup).to.be(false)
    expect(game.numberOfHumanPlayers).to.be(0)
    expect(game.numberOfAiPlayers).to.be(0)
  })

  describe('#setNumberOfHumanPlayers', ()=>{
    it('should set numberOfHumanPlayers and call onChange', ()=>{
      var onChange = sinon.spy();
      var game = new BlackjackGame(onChange)
      expect(game.numberOfHumanPlayers).to.be(0)
      expect(onChange.callCount).to.be(0)
      game.setNumberOfHumanPlayers(8)
      expect(onChange.callCount).to.be(1)
      expect(game.numberOfHumanPlayers).to.be(8)
    })
  })

  describe('#setNumberOfAiPlayers', ()=>{
    it('should set numberOfAiPlayers and call onChange', ()=>{
      var onChange = sinon.spy();
      var game = new BlackjackGame(onChange)
      expect(game.numberOfAiPlayers).to.be(0)
      expect(onChange.callCount).to.be(0)
      game.setNumberOfAiPlayers(8)
      expect(onChange.callCount).to.be(1)
      expect(game.numberOfAiPlayers).to.be(8)
    })
  })
  
  describe('#completeSetup', ()=>{
    it('should set .setup=true and call onChange', ()=>{
      var onChange = sinon.spy();
      var game = new BlackjackGame(onChange)
      expect(onChange.callCount).to.be(0)
      expect(game.setup).to.be(false)
      game.completeSetup()
      expect(onChange.callCount).to.be(1)
      expect(game.setup).to.be(true)
    })
  })
})