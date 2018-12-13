pragma solidity ^0.4.24;

contract Puzzle {
  address private lastAttempter;
  uint public reward;
  bytes32 hash = 0xe0576260dc01f430e95b8943ab1653e30caa01ff804b2ef61f0169d0bd49e8cf;
    
  constructor() payable {
    reward = msg.value;
  }
    
  function solve(bytes16 _solution){
    if(keccak256(bytes16(_solution))==hash && lastAttempter!=msg.sender){
      msg.sender.send(reward);
    }
    lastAttempter=msg.sender;
    }
}
