// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./Switch2.sol";

contract SwitchFactory2 is Level {
    function createInstance(address) public payable override returns (address) {
        Switch2 instance = new Switch2();
        return address(instance);
    }

    function validateInstance(address payable _instance, address _player)
        public
        view
        override
        returns (bool)
    {
        Switch2 instance = Switch2(_instance);
        return instance.owner() == _player;
    }
}
