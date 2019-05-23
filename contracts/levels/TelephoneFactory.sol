pragma solidity ^0.5.0;

import './base/Level.sol';
import './Telephone.sol';

contract TelephoneFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    Telephone instance = new Telephone();
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) public returns (bool) {
    Telephone instance = Telephone(_instance);
    return instance.owner() == _player;
  }
}
