pragma solidity ^0.6.0;

import './base/Level.sol';
import './Elevator.sol';

contract ElevatorFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    _player;
    Elevator instance = new Elevator();
    return address(instance);
  }

  function validateInstance(address payable _instance, address) override public returns (bool) {
    Elevator elevator = Elevator(_instance);
    return elevator.top();
  }

}
