## Story

Taking the first step can be intimidating. Here's one to help you along with writing and deploying your first smart contract. For the seasoned developer, it's a chance to relieve that moment again!

## Challenge

Create a smart contract that returns the quote `That's one small step for man, one giant leap for mankind.` (with the period at the end) for the function `quote()`. 

### Stamp Collector's Interface

If you need an interface for your smart contract:

```
pragma solidity ^0.5.0;

interface IOneSmallStep {
  function quote() external pure returns (string memory);
}
```

### Submission

Deploy your contract and submit the contract with the `submitContract(address)` method:

```
await contract.methods.submitContract("<0xYOUR-CONTRACT-ADDRESS>").send()
```