import expect from 'expect.js'
import sinon from 'sinon'
import Deck from 'browser/BlackjackGame/Deck'

describe('BlackjackGame.Deck', ()=>{
  it('should be a class', ()=>{
    expect(Deck).to.be.a('function')
    var deck = new Deck('2', '♥')
    expect(deck).to.be.a(Deck)
    expect(deck.cards.length).to.equal(52)
  })

  // describe('#shuffel')
})