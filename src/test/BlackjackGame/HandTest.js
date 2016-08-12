import expect from 'expect.js'
import sinon from 'sinon'
import Card from 'browser/BlackjackGame/Card'
import Hand from 'browser/BlackjackGame/Hand'

describe('BlackjackGame.Hand', ()=>{
  it('should be a class', ()=>{
    expect(Hand).to.be.a('function')
    var hand = new Hand({})
    expect(hand).to.be.a(Hand)
    expect(hand.cards.length).to.equal(0)
  })

  describe('#value', ()=>{
    it('should calculate the highest possible value (<=21) for the hand', ()=>{
      var hand = new Hand({})
      hand.cards = [
        new Card('10', '♥'),
        new Card('5', '♥'),
      ]
      expect(hand.value()).to.equal(15)

      hand.cards = [
        new Card('A', '♥'),
        new Card('K', '♥'),
      ]
      expect(hand.value()).to.equal(21)

      hand.cards = [
        new Card('2', '♥'),
        new Card('A', '♥'),
        new Card('K', '♥'),
      ]
      expect(hand.value()).to.equal(13)

      hand.cards = [
        new Card('A', '♥'),
        new Card('A', '♥'),
        new Card('K', '♥'),
      ]
      expect(hand.value()).to.equal(12)

      hand.cards = [
        new Card('K', '♥'),
        new Card('A', '♥'),
        new Card('A', '♥'),
      ]
      expect(hand.value()).to.equal(12)

      hand.cards = [
        new Card('A', '♥'),
        new Card('K', '♥'),
        new Card('A', '♥'),
      ]
      expect(hand.value()).to.equal(12)
    })
  })

  // describe('#shuffel')
})
