pragma solidity ^0.4.18;

import './base/Level.sol';
import './Instance.sol';

contract InstanceFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return new Instance('ethernaut0');
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    _player;
    Instance instance = Instance(_instance);
    return instance.getCleared();
  }
}
