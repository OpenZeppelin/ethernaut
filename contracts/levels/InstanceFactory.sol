pragma solidity ^0.5.0;

import './base/Level.sol';
import './Instance.sol';

contract InstanceFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return address(new Instance('ethernaut0'));
  }

  function validateInstance(address payable _instance, address _player) public returns (bool) {
    _player;
    Instance instance = Instance(_instance);
    return instance.getCleared();
  }
}
