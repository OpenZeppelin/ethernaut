pragma solidity ^0.4.18;

import './base/Level.sol';
import './Fallout.sol';

contract FalloutFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return new Fallout();
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    Fallout instance = Fallout(_instance);
    return instance.owner() == _player;
  }
}
