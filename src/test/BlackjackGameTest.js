import expect from 'expect.js'
import sinon from 'sinon'
import BlackjackGame from 'browser/BlackjackGame'

describe('BlackjackGame', ()=>{
  it('should be a class', ()=>{
    expect(BlackjackGame).to.be.a('function')
    var game = new BlackjackGame
    expect(game).to.be.a(BlackjackGame)
  })

  describe('#constructor', ()=>{
    it('should set onChange, setup and playerNames', ()=>{
      var onChange = sinon.spy();
      var game = new BlackjackGame(onChange)
      expect(game.onChange).to.be(onChange)  
      expect(game.setup).to.be(false)
      expect(game.playerNames).to.be.empty()
    })
  })
  
  describe('#setPlayerNames', ()=>{
    it('should set this.playerNames and call onChange', () =>{
      var onChange = sinon.spy();
      var game = new BlackjackGame(onChange)
      expect(game.playerNames).to.be.empty()
      game.setPlayerNames(['Jared', 'Majid'])
      expect(game.playerNames).to.have.length(2)
      expect(game.playerNames[0]).to.equal('Jared')
      expect(game.playerNames[1]).to.equal('Majid')
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