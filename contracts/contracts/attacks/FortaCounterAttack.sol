// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "@openzeppelin/contracts/utils/Address.sol";

contract FortaCounterAttack {

    uint256 counter;

    function changeValue() external returns(bytes memory) {
        counter -= 1;
    }
}