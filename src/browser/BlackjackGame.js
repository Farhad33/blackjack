export default class BlackjackGame {
  constructor(onChange){
    this.onChange = onChange;
    this.setup = false;
    this.numberOfHumanPlayers = 0;
    this.numberOfAiPlayers = 0;
  }

  setNumberOfHumanPlayers(value){
    if (typeof value !== 'number') value = parseInt(value, 10)
    this.numberOfHumanPlayers = value;
    this.onChange()
    return this;
  }

  setNumberOfAiPlayers(value){
    if (typeof value !== 'number') value = parseInt(value, 10)
    this.numberOfAiPlayers = value;
    this.onChange()
    return this;
  }

  completeSetup(){
    this.setup = true;
    this.onChange()
    return this;
  }
}