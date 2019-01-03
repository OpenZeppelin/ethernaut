pragma solidity ^0.5.0;

import "./IFizzBuzz.sol";

contract FizzBuzzValidator {
  bool public cleared = false;
  
  function compareString(string memory s1, string memory s2) internal pure returns (bool){
    return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
  }
  
  function submitContract(address answer) public {
    IFizzBuzz fizzBuzz = IFizzBuzz(answer);
    
    require(compareString(fizzBuzz.fizzBuzz(1), "1"), "fizzBuzz(1) failed");
    require(compareString(fizzBuzz.fizzBuzz(3), "Fizz"), "fizzBuzz(3) failed");
    require(compareString(fizzBuzz.fizzBuzz(5), "Buzz"), "fizzBuzz(5) failed");
    require(compareString(fizzBuzz.fizzBuzz(15), "FizzBuzz"), "fizzBuzz(15) failed");
    
    require(
      compareString(
        fizzBuzz.fizzBuzz(57896044618658097711785492504343953926634992332820282019728792003956564819960),
        "FizzBuzz"
      ),
      "fizzBuzz(57896044618658097711785492504343953926634992332820282019728792003956564819960) failed"
    );
    require(
      compareString(
        fizzBuzz.fizzBuzz(57896044618658097711785492504343953926634992332820282019728792003956564819961),
        "57896044618658097711785492504343953926634992332820282019728792003956564819961"
      ),
      "fizzBuzz(57896044618658097711785492504343953926634992332820282019728792003956564819961) failed"
    );
    require(
      compareString(
        fizzBuzz.fizzBuzz(57896044618658097711785492504343953926634992332820282019728792003956564819965),
        "Buzz"
      ),
      "fizzBuzz(57896044618658097711785492504343953926634992332820282019728792003956564819965) failed"
    );
    require(
      compareString(
        fizzBuzz.fizzBuzz(57896044618658097711785492504343953926634992332820282019728792003956564819966),
        "Fizz"
      ),
      "fizzBuzz(57896044618658097711785492504343953926634992332820282019728792003956564819966) failed"
    );
    
    cleared = true;
  }
}