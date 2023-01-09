// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./MagicNum.sol";
import "./base/Level.sol";

interface Solver {
  function whatIsTheMeaningOfLife() external view returns (bytes32);
}

contract MagicNumFactory is Level {

  function createInstance(address) override public payable returns (address) {
    return address(new MagicNum());
  }

  function validateInstance(address payable _instance, address) override public returns (bool) {

    // Retrieve the instance.
    MagicNum instance = MagicNum(_instance);

    // Retrieve the solver from the instance.
    Solver solver = Solver(instance.solver());
    
    // Query the solver for the magic number.
    bytes32 magic = solver.whatIsTheMeaningOfLife();
    if(magic != 0x000000000000000000000000000000000000000000000000000000000000002a) return false;
    
    // Require the solver to have at most 10 opcodes.
    uint256 size;
    assembly {
      size := extcodesize(solver)
    }
    if(size > 10) return false;
    
    return true;
  }
}
