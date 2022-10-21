// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './base/Level.sol';
import './Dummy.sol';

contract DummyFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    _player;
    return address(new Dummy());
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player;
    Dummy instance = Dummy(_instance);
    return instance.completed();
  }
}
