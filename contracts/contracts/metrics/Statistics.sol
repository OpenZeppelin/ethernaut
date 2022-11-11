// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Statistics is Initializable {
    address public ethernaut;
    address[] public players;
    address[] public levels;
    uint256 private globalNumberOfInstancesCreated;
    uint256 private globalNumberOfInstancesSolved;
    uint256 private globalNumberOfInstancesFailures;
    struct LevelInstance {
        address instance;
        bool isCompleted;
        uint256 timeCreated;
        uint256 timeCompleted;
        uint256[] timeSubmitted;
    }
    struct Level {
        uint256 noOfInstancesCreated;
        uint256 noOfInstancesSubmitted_Success;
        uint256 noOfInstancesSubmitted_Fail;
    }
    mapping(address => uint256) private globalNumberOfInstancesCreatedByPlayer;
    mapping(address => uint256) private globalNumberOfInstancesSolvedByPlayer;
    mapping(address => uint256) private globalNumberOfInstancesFailuresByPlayer;
    mapping(address => Level) private levelStats;
    mapping(address => mapping(address => LevelInstance)) private playerStats;
    mapping(address => bool) private playerExists;
    mapping(address => bool) private levelExists;
    modifier levelExistsCheck(address level) {
        require(doesLevelExist(level), "Level doesn't exist");
        _;
    }
    modifier levelDoesntExistCheck(address level) {
        require(!doesLevelExist(level), "Level already exists");
        _;
    }
    modifier playerExistsCheck(address player) {
        require(doesPlayerExist(player), "Player doesn't exist");
        _;
    }
    modifier onlyEthernaut() {
        require(
            msg.sender == ethernaut,
            "Only Ethernaut can call this function"
        );
        _;
    }

    function initialize(address _ethernautAddress) public initializer {
        ethernaut = _ethernautAddress;
    }

    // Protected functions
    function createNewInstance(
        address instance,
        address level,
        address player
    ) external onlyEthernaut levelExistsCheck(level) {
        if (!doesPlayerExist(player)) {
            players.push(player);
            playerExists[player] = true;
        }
        playerStats[player][level] = LevelInstance(
            instance,
            false,
            block.timestamp,
            0,
            playerStats[player][level].timeSubmitted.length != 0
                ? playerStats[player][level].timeSubmitted
                : new uint256[](0)
        );

        levelStats[level].noOfInstancesCreated++;
        globalNumberOfInstancesCreated++;
        globalNumberOfInstancesCreatedByPlayer[player]++;
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
            playerStats[player][level].instance == instance,
            "Submitted instance is not the created one"
        );

        require(
            playerStats[player][level].isCompleted == false,
            "Level already completed"
        );
        playerStats[player][level].timeSubmitted.push(block.timestamp);
        playerStats[player][level].timeCompleted = block.timestamp;
        playerStats[player][level].isCompleted = true;
        levelStats[level].noOfInstancesSubmitted_Success++;
        globalNumberOfInstancesSolved++;
        globalNumberOfInstancesSolvedByPlayer[player]++;
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
            playerStats[player][level].instance == instance,
            "Submitted instance is not the created one"
        );
        require(
            playerStats[player][level].isCompleted == false,
            "Level already completed"
        );
        playerStats[player][level].timeSubmitted.push(block.timestamp);
        levelStats[level].noOfInstancesSubmitted_Fail++;
        globalNumberOfInstancesFailures++;
        globalNumberOfInstancesFailuresByPlayer[player]++;
    }

    function saveNewLevel(address level)
        external
        levelDoesntExistCheck(level)
        onlyEthernaut
    {
        levelExists[level] = true;
        levels.push(level);
    }

    // Player specific metrics
    // number of levels created by player
    function getTotalNoOfLevelsCreatedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNumberOfInstancesCreatedByPlayer[player];
    }

    // number of levels completed by player
    function getTotalNoOfLevelsCompletedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNumberOfInstancesSolvedByPlayer[player];
    }

    // number of levels failed by player
    function getTotalNoOfLevelsFailedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNumberOfInstancesFailuresByPlayer[player];
    }

    // number of failed submissions of a specific level by player (0 if player didn't play the level)
    function getTotalNoOfFailuresForLevelAndPlayer(
        address level,
        address player
    )
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        return
            playerStats[player][level].instance != address(0)
                ? playerStats[player][level].timeSubmitted.length
                : 0;
    }

    // Is a specific level solved by a specific player ?
    function isLevelCompleted(address player, address level)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (bool)
    {
        return playerStats[player][level].isCompleted;
    }

    // How much time a player took to solve a level (in seconds)
    function getTimeElapsedForCompletionOfLevel(address player, address level)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        require(playerStats[player][level].isCompleted, "Level not completed");
        return
            playerStats[player][level].timeCompleted -
            playerStats[player][level].timeCreated;
    }

    // Get a specific submission time per level and player
    // Useful to measure differences between submissions time
    function getSubmissionsForLevelByPlayer(
        address player,
        address level,
        uint256 index
    )
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        require(
            playerStats[player][level].timeSubmitted.length >= index,
            "Index outbounded"
        );
        return playerStats[player][level].timeSubmitted[index];
    }

    // Percentage of total levels completed by player (1e18 = 100%)
    function getPercentageOfLevelsCompleted(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        // Changed from 100 to 1e18 otherwise when levels.length > 100 this will round to 0 always
        return
            (getTotalNoOfLevelsCompletedByPlayer(player) * 1e18) /
            levels.length;
    }

    // Game specific metrics
    function getTotalNoOfLevelsCreated() public view returns (uint256) {
        return globalNumberOfInstancesCreated;
    }

    function getTotalNoOfLevelsCompleted() public view returns (uint256) {
        return globalNumberOfInstancesSolved;
    }

    function getTotalNoOfLevelsFailures() public view returns (uint256) {
        return globalNumberOfInstancesFailures;
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

    // Internal functions
    function doesLevelExist(address level) public view returns (bool) {
        return levelExists[level];
    }

    function doesPlayerExist(address player) public view returns (bool) {
        return playerExists[player];
    }
}
