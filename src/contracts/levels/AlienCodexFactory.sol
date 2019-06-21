pragma solidity ^0.4.24;

import './base/Level.sol';
import './AlienCodex.sol';

contract AlienCodexFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return new AlienCodex();
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    // _player;
    AlienCodex instance = AlienCodex(_instance);
    return instance.owner() ==_player;
  }
}
