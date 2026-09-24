// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Level} from "./base/Level.sol";
import {FlashQuorum} from "./FlashQuorum.sol";
import {FlashQuorumToken} from "./FlashQuorumToken.sol";

contract FlashQuorumFactory is Level {
    address constant DAO = address(0xDA0);
    uint256 constant TOTAL_SUPPLY = 1_000 ether;
    uint256 constant QUORUM = 500 ether;
    // Just enough to cover the flash loan fee (0.3% of QUORUM = 1.5 GOV) with
    // room to spare. Nowhere near enough to reach quorum by holding it outright.
    uint256 constant PLAYER_FEE_RESERVE = 2 ether;

    function createInstance(address _player) public payable override returns (address) {
        FlashQuorumToken govToken = new FlashQuorumToken(TOTAL_SUPPLY, DAO, _player, PLAYER_FEE_RESERVE);
        FlashQuorum instance = new FlashQuorum{value: msg.value}(govToken, QUORUM);
        return address(instance);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        _player;
        return FlashQuorum(_instance).drained();
    }
}
