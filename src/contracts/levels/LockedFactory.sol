pragma solidity ^0.4.18;

import './base/Level.sol';
import './Locked.sol';

contract LockedFactory is Level {

  function createInstance(address) public payable returns (address) {
    Locked instance = new Locked();
    return instance;
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player; // suppress warnings
    Locked instance = Locked(_instance);
    return instance.unlocked() == true;
  }
}
