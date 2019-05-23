pragma solidity ^0.5.0;

import './base/Level.sol';
import './GatekeeperOne.sol';

contract GatekeeperOneFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    GatekeeperOne instance = new GatekeeperOne();
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) public returns (bool) {
    GatekeeperOne instance = GatekeeperOne(_instance);
    return instance.entrant() == _player;
  }
}
