// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './base/Level.sol';
import './ShapeShifter.sol';

contract ShapeShifterFactory is Level {
  function createInstance(address _player) override public payable returns (address) {
    _player;
    ShapeShifter instance = new ShapeShifter();
    return payable(address(instance));
  }

  function validateInstance(address payable _instance, address) override public view returns (bool) {
    ShapeShifter instance = ShapeShifter(_instance);
    return instance.unlocked();
  }
}
