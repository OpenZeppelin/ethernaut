// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Stats {
    struct LevelInstance {
        address instanceAddress;
        bool isCompleted;
        uint256 timeCreated;
        uint256 timeCompleted;
        uint256[] timeSubmitted;
    }
    mapping(address => mapping(address => LevelInstance)) playerStats;
    mapping(address => bool) playerExists;
    address[] players;
    struct Level {
        uint256 noOfInstancesCreated;
        uint256 noOfInstancesSubmitted_Success;
        uint256 noOfInstancesSubmitted_Fail;
    }
    mapping(address => Level) public levelStats;
}