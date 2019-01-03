pragma solidity ^0.5.0;

contract Stamp {
  bytes32 public id;
  uint public rarity;
  
  constructor(bytes32 _id, uint _rarity) public {
    id = _id;
    rarity = _rarity;
  }
}