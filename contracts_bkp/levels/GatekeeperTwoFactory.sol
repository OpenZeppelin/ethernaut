pragma solidity ^0.4.18;

import './base/Level.sol';
import './GatekeeperTwo.sol';

contract GatekeeperTwoFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    GatekeeperTwo instance = new GatekeeperTwo();
    return instance;
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    GatekeeperTwo instance = GatekeeperTwo(_instance);
    return instance.entrant() == _player;
  }
}
