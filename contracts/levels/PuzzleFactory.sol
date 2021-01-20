pragma solidity ^0.4.24;

import './base/Level.sol';
import './Puzzle.sol';

contract PuzzleFactory is Level {
  PuzzleSolver solver;
  uint public deploymentCost = 1 ether;
  
  constructor() public {
    solver = new PuzzleSolver();
  }

  function createInstance(address _player) public payable returns (address) {
    _player;
    require(msg.value >= deploymentCost);
    Puzzle puzzle = (new Puzzle).value(msg.value)();
    solver.call(bytes4(keccak256('solve(address)')),address(puzzle)); //attempt to solve puzzle
    return puzzle;
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    Puzzle puzzle = Puzzle(_instance);
    return address(puzzle).balance==0;
  }
}

contract PuzzleSolver {
  function solve(address puzzle) public {
    puzzle.call(0x85755f48,bytes16(0x1ced777decaf777c0ffee77777777777));
  }
    
  function() public{
    revert();
  }
}
