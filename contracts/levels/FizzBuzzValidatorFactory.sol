pragma solidity ^0.5.0;

import "./base/Level.sol";
import "./FizzBuzzValidator.sol";

contract FizzBuzzValidatorFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    FizzBuzzValidator instance = new FizzBuzzValidator();
    return address(instance);
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    FizzBuzzValidator instance = FizzBuzzValidator(_instance);
    return instance.cleared();
  }
}
