pragma solidity ^0.6.0;

import './base/Level.sol';
import './SecretNumber.sol';

contract SecretNumberFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    _player;
    return address(new SecretNumber());
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player;
    SecretNumber instance = SecretNumber(_instance);
    return instance.owner() == _player;
  }
}