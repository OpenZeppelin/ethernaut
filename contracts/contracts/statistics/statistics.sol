// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Statistics {
    struct LevelInstance {
        address instance;
        bool isCompleted;
        uint256 timeCreated;
        uint256 timeCompleted;
        uint256[] timeSubmitted;
    }
    mapping(address => mapping(address => LevelInstance)) playerStats;
    mapping(address => bool) public playerExists;
    address[] players;

    struct Level {
        uint256 noOfInstancesCreated;
        uint256 noOfInstancesSubmitted_Success;
        uint256 noOfInstancesSubmitted_Fail;
    }
    mapping(address => Level) public levelStats;
    address[] public levels;

    function createNewInstance(address instance, address level, address user) levelExistsCheck(instance) external {
        if(playerExists[user] == false) {
            players.push(user);
            playerExists[user] = true;
        }
        require(playerStats[user][level].instance == address(0), "Level already created");
        playerStats[user][level] = LevelInstance(instance, false, block.timestamp, 0, new uint256[](0));
        levelStats[level].noOfInstancesCreated++;
    }

    function submitSuccess(address level, address user) external levelExistsCheck(level) playerExistsCheck(user) {
        require(playerStats[user][level].instance != address(0), "Level not created");
        require(playerStats[user][level].isCompleted == false, "Level already completed");

        playerStats[user][level].timeSubmitted.push(block.timestamp);
        
        playerStats[user][level].timeCompleted = block.timestamp;
        playerStats[user][level].isCompleted = true;

        levelStats[level].noOfInstancesSubmitted_Success++;
    }

    function submitFailure(address level, address user) external levelExistsCheck(level) playerExistsCheck(user) {
        require(playerStats[user][level].instance != address(0), "Level not created");
        require(playerStats[user][level].isCompleted == false, "Level already completed");

        playerStats[user][level].timeSubmitted.push(block.timestamp);

        levelStats[level].noOfInstancesSubmitted_Fail++;
    }

    function saveNewLevel(address level) public {
        require(doesLevelExist(level) == false, "Level already exists");
        levels.push(level);
    }

    function getNoOfLevelsCompleted(address player) playerExistsCheck(player) public view returns(uint256) {
        uint256 noOfLevelsCompleted = 0;
        for(uint256 i = 0; i < levels.length; i++) {
            if(playerStats[player][levels[i]].isCompleted) {
                noOfLevelsCompleted++;
            }
        }
        return noOfLevelsCompleted;
    }

    function isLevelSolved(address playerAddress, address level) playerExistsCheck(playerAddress) levelExistsCheck(level) public view returns(bool) {
        return playerStats[playerAddress][level].isCompleted;
    }

    function getTimeElapsedSinceCompletionOfLevel(address playerAddress, address levelFactoryAddress) playerExistsCheck(playerAddress) levelExistsCheck(levelFactoryAddress) public view returns(uint256) {
        require(playerStats[playerAddress][levelFactoryAddress].isCompleted, "Level not completed");
        return block.timestamp - playerStats[playerAddress][levelFactoryAddress].timeCompleted;
    }

    function getPercentageOfLevelsSolvedByPlayer(address playerAddress) playerExistsCheck(playerAddress) public view returns(uint256) {
        return (getNoOfLevelsCompleted(playerAddress) * 100) / levels.length;
    }

    function getTotalNoOfInstancesCreated() public view returns(uint256) {
        uint256 totalNoOfLevelInstancesCreated = 0;
        for(uint256 i = 0; i < levels.length; i++) {
            totalNoOfLevelInstancesCreated += levelStats[levels[i]].noOfInstancesCreated;
        }
        return totalNoOfLevelInstancesCreated;
    }

    function getTotalNoOfInstancesSolved() public view returns(uint256) {
        uint256 totalNoOfLevelInstancesSolved = 0;
        for(uint256 i = 0; i < levels.length; i++) {
            totalNoOfLevelInstancesSolved += levelStats[levels[i]].noOfInstancesSubmitted_Success;
        }
        return totalNoOfLevelInstancesSolved;
    }

    function getTotalNoOfUniquePlayers() public view returns(uint256) {
        return players.length;
    }

    function doesLevelExist(address level) private view returns(bool) {
        for(uint256 i = 0; i < levels.length; i++) {
            if(levels[i] == level) {
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