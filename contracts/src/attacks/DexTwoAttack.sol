// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DexTwoAttackToken {
    function balanceOf(address) external pure returns (uint256) {
        return 1;
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        return true;
    }
}
