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
})