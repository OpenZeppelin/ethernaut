pragma solidity ^0.5.0;

import "./base/Level.sol";
import "./OneSmallStepValidator.sol";

contract OneSmallStepValidatorFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return address(new OneSmallStepValidator());
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    OneSmallStepValidator instance = OneSmallStepValidator(_instance);
    return instance.cleared();
  }
}
