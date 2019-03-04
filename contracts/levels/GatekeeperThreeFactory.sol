pragma solidity ^0.4.24;

import './base/Level.sol';
import './GatekeeperThree.sol';

contract GatekeeperThreeFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    GatekeeperThree instance = new GatekeeperThree();
    return instance;
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    GatekeeperThree instance = GatekeeperThree(_instance);
    return instance.entrant() == _player;
  }
}
