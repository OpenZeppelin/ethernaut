## Story

As a newly stamp collector, your job is to collect the different stamps from around the world. However, before that, you need to learn to differentiate a real stamp amongst the fakes. 

## Challenge

Your role is to write a smart contract `StampCollector` to collect stamps. It should differentiates a `Stamp` and `NotStamp`. There are certain properties that make these two look different from each other. 


### Stamp Contract
```
pragma solidity ^0.5.0;

contract Stamp {
  bytes32 public id;
  uint public rarity;
  
  constructor(bytes32 _id, uint _rarity) public {
    id = _id;
    rarity = _rarity;
  }
}
```

### NotStamp Contract
```
pragma solidity ^0.5.0;

contract NotStamp {
  bytes32 public notId;
  uint public notRarity;
  
  constructor(bytes32 _id, uint _rarity) public {
    notId = _id;
    notRarity = _rarity;
  }
}
```

Deploy and submit the contract address of your `StampCollector` contract to the instance via `submitContract(address)` to complete the challenge.

Your smart contract should implement the Stamp Collector's Interface, `IStampCollector`, below:

### Stamp Collector's Interface
```
pragma solidity ^0.5.0;

interface IStampCollector {
  function isCollected(address stamp) external returns (bool);
  function collectStamp(address stamp) external;
}
```
