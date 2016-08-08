import expect from 'expect.js'
import Game from 'browser/Game'

describe('Game', () => {
  it('should be a constructor', ()=>{
    expect(Game).to.be.a('function')
    var game = new Game;
    expect(game).to.be.a(Game)
    expect(game.players).to.be.a(Array)
    expect(game.players).to.be.empty()
  })
})
