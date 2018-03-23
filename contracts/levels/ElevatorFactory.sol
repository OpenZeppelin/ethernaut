pragma solidity ^0.4.18;

import './base/Level.sol';
import './Elevator.sol';

contract ElevatorFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    Elevator instance = new Elevator();
    return instance;
  }

  function validateInstance(address _instance, address _player) public view returns (bool) {
    Elevator elevator = Elevator(_instance);
    return elevator.top();
  }

}
