// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleMath {
    uint8 public result;

    function multiply(uint8 a, uint8 b) public {
        result = a * b; // players will try to overflow
    }

    function isSolved() public view returns (bool) {
        return result < 255; // simple check for overflow
    }
}