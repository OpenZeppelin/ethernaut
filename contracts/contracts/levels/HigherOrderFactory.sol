// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./base/Level-06.sol";
import "./HigherOrder.sol";

contract HigherOrderFactory is Level {
    function createInstance(
        address _player
    ) public payable override returns (address) {
        return address(new HigherOrder());
    }

    function validateInstance(
        address payable _instance,
        address _player
    ) public override returns (bool) {
        HigherOrder instance = HigherOrder(_instance);
        return instance.commander() == _player;
    }
}
