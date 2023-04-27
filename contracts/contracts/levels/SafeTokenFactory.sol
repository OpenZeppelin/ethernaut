// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './base/Level.sol';
import './SafeTokenBackdoor.sol';

contract SafeTokenFactory is Level {

  function createInstance(address) override public payable returns (address) {   
    return address(new SafeTokenBackdoor());
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    SafeTokenBackdoor instance = SafeTokenBackdoor(_instance);
    return instance.balanceOf(instance.owner()) == 0;
  }
}
