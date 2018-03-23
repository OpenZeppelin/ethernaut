pragma solidity ^0.4.18;

import './base/Level.sol';
import './Telephone.sol';

contract TelephoneFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    Telephone instance = new Telephone();
    return instance;
  }

  function validateInstance(address _instance, address _player) public view returns (bool) {
    Telephone instance = Telephone(_instance);
    return instance.owner() == _player;
  }
}
