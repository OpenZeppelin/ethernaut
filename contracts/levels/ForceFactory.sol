pragma solidity ^0.5.0;

import './base/Level.sol';
import './Force.sol';

contract ForceFactory {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return address(new Force());
  }

  function validateInstance(address payable _instance, address _player) public view returns (bool) {
    _player;
    Force instance = Force(_instance);
    return address(instance).balance > 0;
  }
}
