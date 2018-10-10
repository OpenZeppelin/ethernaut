pragma solidity ^0.4.24;

import './base/Level.sol';
import './Bulletin.sol';

contract BulletinFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return new Bulletin();
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    // _player;
    Bulletin instance = Bulletin(_instance);
    return instance.owner() ==_player;
  }
}
