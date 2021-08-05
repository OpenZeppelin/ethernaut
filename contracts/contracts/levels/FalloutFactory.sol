pragma solidity ^0.6.0;

import './base/Level.sol';
import './Fallout.sol';

contract FalloutFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    _player;
    Fallout instance = new Fallout();
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    Fallout instance = Fallout(_instance);
    return instance.owner() == _player;
  }
}
