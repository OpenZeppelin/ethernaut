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

    function saveCreateLevelStats(address levelInstanceAddress, address levelFactoryAddress) public {
        if(playerExists[msg.sender] == false) {
            players.push(msg.sender);
            playerExists[msg.sender] = true;
        }
        require(playerStats[msg.sender][levelFactoryAddress].instanceAddress == address(0), "Level already created");
        playerStats[msg.sender][levelFactoryAddress] = LevelInstance(levelInstanceAddress, false, block.timestamp, 0, new uint256[](0));
        levelStats[levelFactoryAddress].noOfInstancesCreated++;
    }

    function saveSubmitLevelStats(address levelFactoryAddress, bool isCompleted) public {
        require(playerStats[msg.sender][levelFactoryAddress].instanceAddress != address(0), "Level not created");
        require(playerStats[msg.sender][levelFactoryAddress].isCompleted == false, "Level already completed");

        playerStats[msg.sender][levelFactoryAddress].timeSubmitted.push(block.timestamp);

        if(isCompleted) {
            levelStats[levelFactoryAddress].noOfInstancesSubmitted_Success++;
            playerStats[msg.sender][levelFactoryAddress].timeCompleted = block.timestamp;
            playerStats[msg.sender][levelFactoryAddress].isCompleted = true;
        } else {
            levelStats[levelFactoryAddress].noOfInstancesSubmitted_Fail++;
        }
    }
}