// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Level} from "./base/Level.sol";
import {FrontRunner} from "./FrontRunner.sol";

contract FrontRunnerFactory is Level {
    address constant ALICE = address(0xA11CE);
    uint256 constant INITIAL_SUPPLY = 1_000 ether;
    uint256 constant INITIAL_ALLOWANCE = 100 ether;
    uint256 constant REDUCED_ALLOWANCE = 10 ether;

    function createInstance(address _player) public payable override returns (address) {
        FrontRunner instance = new FrontRunner(ALICE, _player, INITIAL_SUPPLY, INITIAL_ALLOWANCE, REDUCED_ALLOWANCE);
        return address(instance);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        FrontRunner instance = FrontRunner(_instance);
        return instance.aliceReduced() && instance.balanceOf(_player) >= INITIAL_ALLOWANCE + REDUCED_ALLOWANCE;
    }
}
