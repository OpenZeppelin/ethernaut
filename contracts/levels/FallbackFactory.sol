pragma solidity ^0.4.18;

import './base/Level.sol';
import './Fallback.sol';

contract FallbackFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    Fallback instance = new Fallback();
    return instance;
  }

  function validateInstance(address _instance, address _player) public view returns (bool) {
    Fallback instance = Fallback(_instance);
    return instance.owner() == _player && instance.balance == 0;
  }
}
