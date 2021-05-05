pragma solidity ^0.6.0;

import './base/Level.sol';
import './Reentrance.sol';

contract ReentranceFactory is Level {

  uint public insertCoin = 1 ether;

  function createInstance(address _player) override public payable returns (address) {
    _player;
    require(msg.value >= insertCoin);
    Reentrance instance = new Reentrance();
    require(address(this).balance >= insertCoin);
    address(instance).transfer(insertCoin);
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player;
    Reentrance instance = Reentrance(_instance);
    return address(instance).balance == 0;
  }

  fallback() external payable {}
}
