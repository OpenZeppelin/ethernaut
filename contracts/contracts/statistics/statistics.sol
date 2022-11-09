// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Statistics {
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
    address[] public levelFactoryAddresses;

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

    function saveNewLevelFactory(address levelFactoryAddress) public {
        require(doesLevelExist(levelFactoryAddress) == false, "Level already exists");
        levelFactoryAddresses.push(levelFactoryAddress);
    }

    function getNoOfLevelsCompletedByPlayer(address playerAddress) playerExistsCheck(playerAddress) public view returns(uint256) {
        uint256 noOfLevelsCompleted = 0;
        for(uint256 i = 0; i < levelFactoryAddresses.length; i++) {
            if(playerStats[playerAddress][levelFactoryAddresses[i]].isCompleted) {
                noOfLevelsCompleted++;
            }
        }
        return noOfLevelsCompleted;
    }

    function isLevelSolvedByPlayer(address playerAddress, address levelFactoryAddress) playerExistsCheck(playerAddress) levelExistsCheck(levelFactoryAddress) public view returns(bool) {
        return playerStats[playerAddress][levelFactoryAddress].isCompleted;
    }

    function getTimeElapsedSinceCompletionOfLevel(address playerAddress, address levelFactoryAddress) playerExistsCheck(playerAddress) levelExistsCheck(levelFactoryAddress) public view returns(uint256) {
        require(playerStats[playerAddress][levelFactoryAddress].isCompleted, "Level not completed");
        return block.timestamp - playerStats[playerAddress][levelFactoryAddress].timeCompleted;
    }

    function getPercentageOfLevelsSolvedByPlayer(address playerAddress) playerExistsCheck(playerAddress) public view returns(uint256) {
        return (getNoOfLevelsCompletedByPlayer(playerAddress) * 100) / levelFactoryAddresses.length;
    }

    function getTotalNoOfLevelInstancesCreated() public view returns(uint256) {
        uint256 totalNoOfLevelInstancesCreated = 0;
        for(uint256 i = 0; i < levelFactoryAddresses.length; i++) {
            totalNoOfLevelInstancesCreated += levelStats[levelFactoryAddresses[i]].noOfInstancesCreated;
        }
        return totalNoOfLevelInstancesCreated;
    }

    function getTotalNoOfLevelInstancesSolved() public view returns(uint256) {
        uint256 totalNoOfLevelInstancesSolved = 0;
        for(uint256 i = 0; i < levelFactoryAddresses.length; i++) {
            totalNoOfLevelInstancesSolved += levelStats[levelFactoryAddresses[i]].noOfInstancesSubmitted_Success;
        }
        return totalNoOfLevelInstancesSolved;
    }

    function getNoOfUniquePlayers() public view returns(uint256) {
        return players.length;
    }

    function doesLevelExist(address levelFactoryAddress) private view returns(bool) {
        for(uint256 i = 0; i < levelFactoryAddresses.length; i++) {
            if(levelFactoryAddresses[i] == levelFactoryAddress) {
                return true;
            }
        }
        return false;
    }

    modifier levelExistsCheck(address levelFactoryAddress) {
        require(doesLevelExist(levelFactoryAddress), "Invalid level factory address");
        _;
    }

    modifier playerExistsCheck(address playerAddress) {
        require(playerExists[playerAddress], "Invalid player address");
        _;
    }
}