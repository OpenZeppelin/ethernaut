pragma solidity ^0.4.18;

import './base/Level.sol';
import './Denial.sol';

contract DenialFactory is Level {

  uint public initialDeposit = 1 ether;

  function createInstance(address _player) public payable returns (address) {
    _player;
    require(msg.value >= initialDeposit);
    Denial instance = new Denial();
    require(instance.call.value(msg.value)());
    return instance;
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    Denial instance = Denial(_instance);
    if (address(instance).balance <= 100 wei) { // cheating otherwise
        return false;
    }
    // fix the gas limit for this call
    return
        !instance.call.gas(500000)(bytes4(keccak256("withdraw()"))); // Must revert
  }

  function() external payable {}

}
