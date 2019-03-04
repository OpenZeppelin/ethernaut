pragma solidity ^0.4.23;

import './base/Level.sol';
import './Door.sol';

contract DoorFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    uint password = 22112018;
    Door instance = new Door(password);
    return instance;
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    Door instance = Door(_instance);
    return instance.open();
  }

}
