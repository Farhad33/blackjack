import React, { Component } from 'react';
import './App.css';
import Card from './components/Card'

class App extends Component {
  render() {
    return (
      <div>
        <div>
          <Card suit="♠" rank="5"    />
          <Card suit="♥" rank="ace"  />
          <Card suit="♦" rank="king" />
          <Card suit="♣" rank="jack" />
        </div>
        <div>
          <Card suit="♠" rank="5"    faceDown/>
          <Card suit="♥" rank="ace"  faceDown/>
          <Card suit="♦" rank="king" faceDown/>
          <Card suit="♣" rank="jack" faceDown/>
        </div>
      </div>
    );
  }
}

export default App;
