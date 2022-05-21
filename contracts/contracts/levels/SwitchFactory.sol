// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import './base/Level.sol';
import './Switch.sol';

contract SwitchFactory is Level {
  function createInstance(address) override public payable returns (address) {
    Switch instance = new Switch();
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    Switch instance = Switch(_instance);
    return instance.owner() == _player;
  }
}
