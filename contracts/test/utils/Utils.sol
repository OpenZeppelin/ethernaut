// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";

import {Ethernaut} from "src/Ethernaut.sol";
import {Statistics} from "src/metrics/Statistics.sol";
import {ProxyStats} from "src/proxy/ProxyStats.sol";
import {Level} from "src/levels/base/Level.sol";

contract Utils is Test {
    bytes32 internal nextUser = keccak256(abi.encodePacked("user address"));

    function getNextUserAddress() external returns (address payable) {
        address payable user = payable(address(uint160(uint256(nextUser))));
        nextUser = keccak256(abi.encodePacked(nextUser));
        return user;
    }

    // create users with 100 ETH balance each
    function createUsers(uint256 userNum) public returns (address payable[] memory) {
        address payable[] memory users = new address payable[](userNum);
        for (uint256 i = 0; i < userNum; i++) {
            address payable user = this.getNextUserAddress();
            vm.deal(user, 100 ether);
            users[i] = user;
        }

        return users;
    }

    // move block.number forward by a given number of blocks
    function mineBlocks(uint256 numBlocks) external {
        uint256 targetBlock = block.number + numBlocks;
        vm.roll(targetBlock);
    }

    function createLevelInstance(Ethernaut ethernaut, Level level, uint256 value) public returns (address instance) {
        vm.recordLogs();
        ethernaut.createLevelInstance{value: value}(level);
        Vm.Log[] memory entries = vm.getRecordedLogs();

        instance = address(uint160(uint256(entries[entries.length - 1].topics[2])));
    }

    function submitLevelInstance(Ethernaut ethernaut, address instance) public returns (bool) {
        vm.recordLogs();
        ethernaut.submitLevelInstance(payable(instance));
        Vm.Log[] memory entries = vm.getRecordedLogs();

        if (entries.length > 1) {
            return true;
        } else {
            return false;
        }
    }

    function getEthernautWithStatsProxy(address owner) public returns (Ethernaut) {
        Ethernaut ethernaut = new Ethernaut();
        Statistics stats = Statistics(address(new ProxyStats(address(new Statistics()), owner, address(ethernaut))));
        ethernaut.setStatistics(address(stats));
        return ethernaut;
    }
}
