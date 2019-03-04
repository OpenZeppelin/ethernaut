pragma solidity ^0.4.24;

import './base/Level.sol';
import './Shuttle.sol';

contract ShuttleFactory is Level{
    
  bytes32 public del = 0x0000000000000000000000000000000000000000000000000000000000000000;

  function createInstance(address _player) public payable returns (address) {
    _player;
    // bytes32[4] passwords;
    // passwords[0] = 0x11;
    // passwords[1] = 0x22;
    // passwords[2] = 0x33;
    // passwords[3] = 0x44;
    // bytes32 password = passwords[uint(now % 4)];
    // del = password;
    bytes32 password = 0x50cb9fe53daa9737b786ab3646f04d0150dc50ef4e75f59509d83667ad5adb20;
    Shuttle instance = new Shuttle(password);
    return address(instance);
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    Shuttle instance = Shuttle(_instance);
    return instance.launched();
  }
}