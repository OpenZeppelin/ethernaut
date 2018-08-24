pragma solidity ^0.4.24;

import "./MagicNum.sol";
import "./base/Level.sol";

contract Solver {
  function whatIsTheMeaningOfLife() public view returns (bytes32);
}

contract MagicNumFactory is Level {

  function createInstance(address) public payable returns (address) {
    return new MagicNum();
  }

  function validateInstance(address _instance, address) public returns (bool) {

    // Retrieve the instance.
    MagicNum instance = MagicNum(_instance);

    // Retrieve the solver from the instance.
    Solver solver = Solver(instance.solver());
    
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
