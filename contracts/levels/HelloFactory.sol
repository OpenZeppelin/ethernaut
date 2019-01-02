pragma solidity ^0.5.0;

import "./base/Level.sol";
import "./Hello.sol";

contract HelloFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return address(new Hello("govtech_ethernaut"));
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    Hello instance = Hello(_instance);
    return instance.getCleared();
  }
}
