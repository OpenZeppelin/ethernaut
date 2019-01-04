pragma solidity ^0.5.0;

import "./base/Level.sol";
import "./StampCollectorValidator.sol";

contract StampCollectorValidatorFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    StampCollectorValidator instance = new StampCollectorValidator();
    return address(instance);
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    StampCollectorValidator instance = StampCollectorValidator(_instance);
    return instance.caught();
  }
}
