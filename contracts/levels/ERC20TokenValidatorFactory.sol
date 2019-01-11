pragma solidity ^0.5.0;

import "./base/Level.sol";
import "./ERC20TokenValidator.sol";

contract ERC20TokenValidatorFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    ERC20TokenValidator instance = new ERC20TokenValidator();
    return address(instance);
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    ERC20TokenValidator instance = ERC20TokenValidator(_instance);
    return instance.cleared();
  }
}
