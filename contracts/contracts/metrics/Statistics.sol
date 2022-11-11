// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Statistics is Initializable {
    address ETHERNAUT_ADDRESS;

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

    function initialize(address _ethernautAddress) public initializer {
        ETHERNAUT_ADDRESS = _ethernautAddress;
    }

    function createNewInstance(
        address instance,
        address level,
        address player
    ) external onlyEthernaut levelExistsCheck(level) {
        if (playerExists[player] == false) {
            players.push(player);
            playerExists[player] = true;
        }
        require(
            playerStats[player][level].instance == address(0),
            "Instance for the level is already created"
        );
        playerStats[player][level] = LevelInstance(
            instance,
            false,
            block.timestamp,
            0,
            new uint256[](0)
        );
        levelStats[level].noOfInstancesCreated++;
    }

    function submitSuccess(
        address instance,
        address level,
        address player
    ) external onlyEthernaut levelExistsCheck(level) playerExistsCheck(player) {
        require(
            playerStats[player][level].instance != address(0),
            "Instance for the level is not created"
        );
        require(
            playerStats[player][level].isCompleted == false,
            "Level already completed"
        );

        playerStats[player][level].timeSubmitted.push(block.timestamp);

        playerStats[player][level].timeCompleted = block.timestamp;
        playerStats[player][level].isCompleted = true;

        levelStats[level].noOfInstancesSubmitted_Success++;
    }

    function submitFailure(
        address instance,
        address level,
        address player
    ) external onlyEthernaut levelExistsCheck(level) playerExistsCheck(player) {
        require(
            playerStats[player][level].instance != address(0),
            "Instance for the level is not created"
        );
        require(
            playerStats[player][level].isCompleted == false,
            "Level already completed"
        );

        playerStats[player][level].timeSubmitted.push(block.timestamp);

        levelStats[level].noOfInstancesSubmitted_Fail++;
    }

    function saveNewLevel(address level) external onlyEthernaut {
        require(
            doesLevelExist(level) == false,
            "Input level factory address is already added"
        );
        levels.push(level);
    }

    function getTotalNoOfLevelsCreatedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        uint256 noOfLevelsCreated = 0;
        for (uint256 i = 0; i < levels.length; i++) {
            if (playerStats[player][levels[i]].instance != address(0)) {
                noOfLevelsCreated++;
            }
        }
        return noOfLevelsCreated;
    }

    function getTotalNoOfLevelsCompletedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        uint256 noOfLevelsCompleted = 0;
        for (uint256 i = 0; i < levels.length; i++) {
            if (playerStats[player][levels[i]].isCompleted) {
                noOfLevelsCompleted++;
            }
        }
        return noOfLevelsCompleted;
    }

    function isLevelCompleted(address player, address level)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (bool)
    {
        return playerStats[player][level].isCompleted;
    }

    function getTimeElapsedForCompletionOfLevel(address player, address level)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        require(playerStats[player][level].isCompleted, "Level not completed");
        return block.timestamp - playerStats[player][level].timeCompleted;
    }

    function getPercentageOfLevelsCompleted(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return
            (getTotalNoOfLevelsCompletedByPlayer(player) * 100) / levels.length;
    }

    function getTotalNoOfLevelsCreated() public view returns (uint256) {
        uint256 totalNoOfLevelsCreated = 0;
        for (uint256 i = 0; i < levels.length; i++) {
            totalNoOfLevelsCreated += levelStats[levels[i]]
                .noOfInstancesCreated;
        }
        return totalNoOfLevelsCreated;
    }

    function getTotalNoOfLevelsCompleted() public view returns (uint256) {
        uint256 totalNoOfLevelsCompleted = 0;
        for (uint256 i = 0; i < levels.length; i++) {
            totalNoOfLevelsCompleted += levelStats[levels[i]]
                .noOfInstancesSubmitted_Success;
        }
        return totalNoOfLevelsCompleted;
    }

    function getTotalNoOfPlayers() public view returns (uint256) {
        return players.length;
    }

    function getNoOfFailedSubmissionForLevel(address level)
        public
        view
        levelExistsCheck(level)
        returns (uint256)
    {
        return levelStats[level].noOfInstancesSubmitted_Fail;
    }

    function getNoOfInstancesForLevel(address level)
        public
        view
        levelExistsCheck(level)
        returns (uint256)
    {
        return levelStats[level].noOfInstancesCreated;
    }

    function getNoOfCompletedSubmissionForLevel(address level)
        public
        view
        levelExistsCheck(level)
        returns (uint256)
    {
        return levelStats[level].noOfInstancesSubmitted_Success;
    }

    function doesLevelExist(address level) private view returns (bool) {
        for (uint256 i = 0; i < levels.length; i++) {
            if (levels[i] == level) {
                return true;
            }
        }
        return false;
    }

    modifier levelExistsCheck(address level) {
        require(doesLevelExist(level), "Invalid level factory address");
        _;
    }

    modifier playerExistsCheck(address player) {
        require(playerExists[player], "Invalid player address");
        _;
    }

    modifier onlyEthernaut() {
        require(
            msg.sender == ETHERNAUT_ADDRESS,
            "Only Ethernaut can call this function"
        );
        _;
    }
}
