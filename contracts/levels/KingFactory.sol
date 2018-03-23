pragma solidity ^0.4.18;

import './base/Level.sol';
import './King.sol';

contract KingFactory is Level {

  uint public insertCoin = 1 ether;

  function createInstance(address _player) public payable returns (address) {
    _player;
    require(msg.value >= insertCoin);
    return (new King).value(msg.value)();
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    King instance = King(_instance);
    !instance.call.value(0)();
    return instance.king() != address(this);
  }

  function() external payable {}

}
