pragma solidity ^0.4.18;

import './base/Level.sol';
import './Reentrance.sol';

contract ReentranceFactory is Level {

  uint public insertCoin = 1 ether;

  function createInstance(address _player) public payable returns (address) {
    _player;
    require(msg.value >= insertCoin);
    Reentrance instance = new Reentrance();
    require(this.balance >= insertCoin);
    instance.transfer(insertCoin);
    return instance;
  }

  function validateInstance(address _instance, address _player) public view returns (bool) {
    _player;
    Reentrance instance = Reentrance(_instance);
    return instance.balance == 0;
  }

  function() payable {}
}
