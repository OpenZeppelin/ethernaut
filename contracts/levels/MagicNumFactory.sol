pragma solidity ^0.4.24;

import "./MagicNum";

contract MagicNumFactory is Level {

  function createInstance(address) public payable returns (address) {
    return new MagicNum();
  }

  function validateInstance(address _instance, address) public returns (bool) {

    // Retrieve program from instance.
    address program = MagicNum(_instance).solver;

    uint256 val;
    uint256 size;
    assembly { 
      let success := call(
        100000, // gas limit
        program, // target address
        0, // cero value
        0, // input mem offset (no input data)
        0, // input mem length (no input length)
        0x1f, // output mem offset
        0x20 // output mem length
      )
      val := mload(0) // fetch the return val in memory
      size := extcodesize(_instance) // read code size of the target address
    }
    if(size > 10) return false;
    if(val != 0x0000000000000000000000000000000000000000000000000000000000000042) return false;
     
    return true;
  }
}
