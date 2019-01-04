## Story

The "Fizz-Buzz test" is an interview question designed to help filter out the 99.5% of programming job candidates who can't seem to program their way out of a wet paper bag. Or is it?

## Challenge

Write a program that implements the function `fizzBuzz(uint256)`. The function should return the number. But for multiples of three return "Fizz" instead of the number and for the multiples of five return "Buzz". For numbers which are multiples of both three and five return "FizzBuzz".

The interface for your `FizzBuzz` contract is as followed:

### FizzBuzz Interface
```
pragma solidity ^0.5.0;

interface IFizzBuzz {
  function fizzBuzz(uint256 num) external pure returns (string memory);
}
```

Deploy and submit the contract address of your `FizzBuzz` contract to the instance via `submitContract(address)` to complete the challenge.
