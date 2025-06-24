// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "openzeppelin-upgradeable/proxy/utils/Initializable.sol";

contract Statistics is Initializable {

    //errors
    error Level_dont_exist();
    error Player_doesnt_exist();
    error Level_already_exists();
    error Player_already_exists();
    error Only_Ethernaut_can_call_this_function();
    error Only_owner_can_call_this_function();
    error Instance_not_created();
    error Submitted_instance_not_created();
    error Level_already_completed();
    error Level_not_completed();
    error Index_outbounded();
    
    address public ethernaut;
    address[] public players;
    address[] public levels;
    uint256 private globalNoOfInstancesCreated;
    uint256 private globalNoOfInstancesCompleted;
    uint256 private globalNoOfFailedSubmissions;

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
        uint256 noOfSubmissions_Failed;
    }

    mapping(address => uint256) private globalNoOfLevelsCompletedByPlayer;
    mapping(address => uint256) private globalNoOfInstancesCreatedByPlayer;
    mapping(address => uint256) private globalNoOfInstancesCompletedByPlayer;
    mapping(address => uint256) private globalNoOfFailedSubmissionsByPlayer;
    mapping(address => Level) private levelStats;
    mapping(address => mapping(address => uint256)) private levelFirstInstanceCreationTime;
    mapping(address => mapping(address => uint256)) private levelFirstCompletionTime;
    mapping(address => mapping(address => LevelInstance)) private playerStats;
    mapping(address => bool) private playerExists;
    mapping(address => bool) private levelExists;
    mapping(address => uint256) private averageTimeTakenToCompleteLevels;

    event playerScoreProfile(
        address indexed player, uint256 indexed averageCompletionTime, uint256 indexed globalLevelsCompleted
    );

    modifier levelExistsCheck(address level) {
        if (!doesLevelExist(level)) revert Level_dont_exist();
        _;
    }

    modifier levelDoesntExistCheck(address level) {
        if (doesLevelExist(level)) revert Level_already_exists();
        _;
    }

    modifier playerExistsCheck(address player) {
        if (!doesPlayerExist(player)) revert Player_doesnt_exist();
        _;
    }

    modifier onlyEthernaut() {
        if (msg.sender != ethernaut) revert Only_Ethernaut_can_call_this_function();
        _;
    }

    function initialize(address _ethernautAddress) public initializer {
        ethernaut = _ethernautAddress;
    }

    function createNewInstance(address instance, address level, address player)
        external
        onlyEthernaut
        levelExistsCheck(level)
    {
        if (!doesPlayerExist(player)) {
            players.push(player);
            playerExists[player] = true;
        }
        if (playerStats[player][level].instance == address(0)) {
            levelFirstInstanceCreationTime[player][level] = block.timestamp;
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
        globalNoOfInstancesCreated++;
        globalNoOfInstancesCreatedByPlayer[player]++;
    }

    function submitSuccess(address instance, address level, address player)
        external
        onlyEthernaut
        levelExistsCheck(level)
        playerExistsCheck(player)
    {
        if (playerStats[player][level].instance == address(0)) revert Instance_not_created();
        if (playerStats[player][level].instance != instance) revert Submitted_instance_not_created();
        if (playerStats[player][level].isCompleted) revert Level_already_completed();
        
        if (levelFirstCompletionTime[player][level] == 0) {
            globalNoOfLevelsCompletedByPlayer[player]++;
            levelFirstCompletionTime[player][level] = block.timestamp;
            uint256 totalNoOfLevelsCompletedByPlayer = globalNoOfLevelsCompletedByPlayer[player];
            uint256 newAverageTimeTakenToCompleteLevels =
                updateAverageTimeTakenToCompleteLevelsByPlayer(player, level, totalNoOfLevelsCompletedByPlayer);
            emit playerScoreProfile(player, newAverageTimeTakenToCompleteLevels, totalNoOfLevelsCompletedByPlayer);
        }
        playerStats[player][level].timeSubmitted.push(block.timestamp);
        playerStats[player][level].timeCompleted = block.timestamp;
        playerStats[player][level].isCompleted = true;
        levelStats[level].noOfInstancesSubmitted_Success++;
        globalNoOfInstancesCompleted++;
        globalNoOfInstancesCompletedByPlayer[player]++;
    }

    function submitFailure(address instance, address level, address player)
        external
        onlyEthernaut
        levelExistsCheck(level)
        playerExistsCheck(player)
    {
        if (playerStats[player][level].instance == address(0)) revert Instance_not_created();
        if (playerStats[player][level].instance != instance) revert Submitted_instance_not_created();
        if (playerStats[player][level].isCompleted) revert Level_already_completed();
        playerStats[player][level].timeSubmitted.push(block.timestamp);
        levelStats[level].noOfSubmissions_Failed++;
        globalNoOfFailedSubmissions++;
        globalNoOfFailedSubmissionsByPlayer[player]++;
    }

    function saveNewLevel(address level) external levelDoesntExistCheck(level) onlyEthernaut {
        levelExists[level] = true;
        levels.push(level);
    }

    function getTotalNoOfLevelInstancesCreatedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNoOfInstancesCreatedByPlayer[player];
    }

    function getTotalNoOfLevelInstancesCompletedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNoOfInstancesCompletedByPlayer[player];
    }

    function getTotalNoOfFailedSubmissionsByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNoOfFailedSubmissionsByPlayer[player];
    }

    function getTotalNoOfLevelsCompletedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNoOfLevelsCompletedByPlayer[player];
    }

    function getTotalNoOfFailuresForLevelAndPlayer(address level, address player)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        return playerStats[player][level].instance != address(0) ? playerStats[player][level].timeSubmitted.length : 0;
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
        if (levelFirstCompletionTime[player][level] == 0) revert Level_not_completed();
        return levelFirstCompletionTime[player][level] - levelFirstInstanceCreationTime[player][level];
    }

    function getSubmissionsForLevelByPlayer(address player, address level, uint256 index)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        if (playerStats[player][level].timeSubmitted.length <= index) revert Index_outbounded();
        return playerStats[player][level].timeSubmitted[index];
    }

    function getPercentageOfLevelsCompleted(address player) public view playerExistsCheck(player) returns (uint256) {
        return (getTotalNoOfLevelsCompletedByPlayer(player) * 1e18) / levels.length;
    }

    function updateAverageTimeTakenToCompleteLevelsByPlayer(
        address player,
        address level,
        uint256 totalNoOfLevelsCompletedByPlayer
    ) private returns (uint256) {
        uint256 lastAverageTime = averageTimeTakenToCompleteLevels[player];
        uint256 newAverageTimeTakenToCompleteLevels;
        uint256 timeTakenForThisSuccessfulSubmission;
        timeTakenForThisSuccessfulSubmission =
            levelFirstCompletionTime[player][level] - levelFirstInstanceCreationTime[player][level];
        if (averageTimeTakenToCompleteLevels[player] == 0) {
            averageTimeTakenToCompleteLevels[player] = timeTakenForThisSuccessfulSubmission;
        } else {
            newAverageTimeTakenToCompleteLevels = (
                (lastAverageTime * (totalNoOfLevelsCompletedByPlayer - 1)) + timeTakenForThisSuccessfulSubmission
            ) / totalNoOfLevelsCompletedByPlayer;
            averageTimeTakenToCompleteLevels[player] = newAverageTimeTakenToCompleteLevels;
        }
        return newAverageTimeTakenToCompleteLevels;
    }

    function getTotalNoOfLevelInstancesCreated() public view returns (uint256) {
        return globalNoOfInstancesCreated;
    }

    function getTotalNoOfLevelInstancesCompleted() public view returns (uint256) {
        return globalNoOfInstancesCompleted;
    }

    function getTotalNoOfFailedSubmissions() public view returns (uint256) {
        return globalNoOfFailedSubmissions;
    }

    function getTotalNoOfPlayers() public view returns (uint256) {
        return players.length;
    }

    function getNoOfFailedSubmissionsForLevel(address level) public view levelExistsCheck(level) returns (uint256) {
        return levelStats[level].noOfSubmissions_Failed;
    }

    function getNoOfInstancesForLevel(address level) public view levelExistsCheck(level) returns (uint256) {
        return levelStats[level].noOfInstancesCreated;
    }

    function getNoOfCompletedSubmissionsForLevel(address level) public view levelExistsCheck(level) returns (uint256) {
        return levelStats[level].noOfInstancesSubmitted_Success;
    }

    function doesLevelExist(address level) public view returns (bool) {
        return levelExists[level];
    }

    function doesPlayerExist(address player) public view returns (bool) {
        return playerExists[player];
    }

    function getTotalNoOfEthernautLevels() public view returns (uint256) {
        return levels.length;
    }

    function getAverageTimeTakenToCompleteLevels(address player) public view returns (uint256) {
        return averageTimeTakenToCompleteLevels[player];
    }

    uint256[44] private __gap;
}
