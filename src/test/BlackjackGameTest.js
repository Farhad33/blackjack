import expect from 'expect.js'
import sinon from 'sinon'
import BlackjackGame from 'browser/BlackjackGame'

describe('BlackjackGame', ()=>{
  it('should be a class', ()=>{
    expect(BlackjackGame).to.be.a('function')
    var game = new BlackjackGame
    expect(game).to.be.a(BlackjackGame)
  })
})