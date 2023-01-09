// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './base/Level.sol';
import './GatekeeperTwo.sol';

contract GatekeeperTwoFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    _player;
    GatekeeperTwo instance = new GatekeeperTwo();
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) override public view returns (bool) {
    GatekeeperTwo instance = GatekeeperTwo(_instance);
    return instance.entrant() == _player;
  }
}
