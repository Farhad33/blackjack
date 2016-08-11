import expect from 'expect.js'
import sinon from 'sinon'
import Deck from 'browser/BlackjackGame/Deck'

describe('BlackjackGame.Deck', ()=>{
  it('should be a class', ()=>{
    expect(Deck).to.be.a('function')
    var deck = new Deck()
    expect(deck).to.be.a(Deck)
    expect(deck.cards.length).to.equal(52)
  })

  it("should add 52 cards for every player", ()=> {
    var deck = new Deck
    expect(deck.cards.length).to.equal(52)
    var deck = new Deck(1)
    expect(deck.cards.length).to.equal(52)
    var deck = new Deck(2)
    expect(deck.cards.length).to.equal(52)
    var deck = new Deck(3)
    expect(deck.cards.length).to.equal(104)
    var deck = new Deck(5)
    expect(deck.cards.length).to.equal(156)
    var deck = new Deck(7)
    expect(deck.cards.length).to.equal(208)
  })

})