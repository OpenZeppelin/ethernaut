pragma solidity ^0.4.24;

import "./MagicNum";

contract MagicNumFactory is Level {

  function createInstance(address) public payable returns (address) {
    return new MagicNum();
  }

  function validateInstance(address _instance, address) public returns (bool) {

    // Retrieve the instance casted as a solver.
    Solver solver = Solver(_instance);
    
    // Query the solver for the magic number.
    bytes32 magic = solver.whatIsTheMeaningOfLife();
    if(magic != 0x0000000000000000000000000000000000000000000000000000000000000042) return false;
    
    // Require the solver to have at most 10 opcodes.
    uint256 size;
    assembly {
      size := extcodesize(solver)
    }
    if(size > 10) return false;
    
    return true;
  }
}
