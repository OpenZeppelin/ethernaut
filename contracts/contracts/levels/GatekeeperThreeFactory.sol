// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './base/Level.sol';
import './GatekeeperThree.sol';

contract GatekeeperThreeFactory is Level {
  function createInstance(address _player) override public payable returns (address) {
    _player;
    GatekeeperThree instance = new GatekeeperThree();
    return payable(instance);
  }

  function validateInstance(address payable _instance, address _player) override public view returns (bool) {
    GatekeeperThree instance = GatekeeperThree(_instance);
    return instance.entrant() == _player;
  }
}
