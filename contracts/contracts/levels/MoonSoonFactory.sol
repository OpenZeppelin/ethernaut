pragma solidity ^0.6.0;

import './base/Level.sol';
import './MoonSoon.sol';

contract MoonSoonFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    _player; // silence compiler
    MoonSoon token = new MoonSoon(address(this)); // set admin role to this factory
    return address(token);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player; // silence compiler
    MoonSoon token = MoonSoon(_instance);
    return token.balanceOf(_player) > 0;
  }
}
