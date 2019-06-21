pragma solidity ^0.4.18;

import './base/Level.sol';
import './Force.sol';

contract ForceFactory {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return new Force();
  }

  function validateInstance(address _instance, address _player) public view returns (bool) {
    _player;
    Force instance = Force(_instance);
    return instance.balance > 0;
  }
}
