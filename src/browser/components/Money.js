import React, { Component } from 'react';

const Money = function(props){
  var dollars = Number(props.dollars)
  if (typeof dollars !== 'number') dollars = 9999999
  return <span>${dollars.toFixed(2)}</span>
}

export default Money
