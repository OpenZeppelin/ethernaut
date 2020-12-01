pragma solidity ^0.6.0;

import './base/Level.sol';
import './Force.sol';

contract ForceFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    _player;
    return address(new Force());
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player;
    Force instance = Force(_instance);
    return address(instance).balance > 0;
  }
}
