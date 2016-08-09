import expect from 'expect.js'
import sinon from 'sinon'
import Card from 'browser/BlackjackGame/Card'

describe('BlackjackGame.Card', ()=>{
  it('should be a class', ()=>{
    expect(Card).to.be.a('function')
    var card = new Card('2', '♥')
    expect(card).to.be.a(Card)
    expect(card.rank).to.equal('2')
    expect(card.suit).to.equal('♥')
  })
})