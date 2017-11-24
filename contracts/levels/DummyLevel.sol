pragma solidity ^0.4.18;

import './base/Level.sol';
import './Dummy.sol';

contract DummyLevel is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return new Dummy();
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    _player;
    Dummy instance = Dummy(_instance);
    return instance.completed();
  }
}