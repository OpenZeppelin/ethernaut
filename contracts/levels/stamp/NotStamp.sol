pragma solidity ^0.5.0;

contract NotStamp {
  bytes32 public notId;
  uint public notRarity;
  
  constructor(bytes32 _id, uint _rarity) public {
    notId = _id;
    notRarity = _rarity;
  }
}
