// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './base/Level.sol';
import './Denial.sol';

contract DenialFactory is Level {

  uint public initialDeposit = 0.001 ether;

  function createInstance(address _player) override public payable returns (address) {
    _player;
    require(
      msg.value >= initialDeposit,
      "Insufficient deposit sent to create an instance."
    );
    Denial instance = new Denial();
    (bool result,) = address(instance).call{value:msg.value}("");
    require(
      result,
      "Failed to initialize the Denial instance with the sent Ether."
    );
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player;
    Denial instance = Denial(_instance);
    if (address(instance).balance <= 100 wei) { // cheating otherwise
        return false;
    }
    // fix the gas limit for this call
    (bool result,) = address(instance).call{gas:1000000}(abi.encodeWithSignature("withdraw()")); // Must revert
    return !result;
  }

  receive() external payable {}

}
