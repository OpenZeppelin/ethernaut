pragma solidity ^0.4.18;

import './base/Level.sol';
import './Shuttle.sol';

contract ShuttleFactory is Level {
    
  bytes32 public del = 0;

  function createInstance(address _player) public payable returns (address) {
    _player;
    bytes32[4] passwords;
    passwords[0] = 0x11;
    passwords[1] = 0x22;
    passwords[2] = 0x33;
    passwords[3] = 0x44;
    bytes32 password = passwords[uint(now % 4)];
    del = password;
    Shuttle instance = new Shuttle(password);
    return instance;
  }

  function validateInstance(address _instance, address) public returns (bool) {
    Shuttle instance = Shuttle(_instance);
    return instance.launched();
  }
}
