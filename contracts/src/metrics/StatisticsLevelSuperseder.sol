// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-upgradeable/proxy/utils/Initializable.sol";
import "openzeppelin-contracts-08/access/Ownable.sol";

contract StatisticsLevelSuperseder is Initializable {
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

    /* Level substitution logic storage */
    bool onMaintenance;
    uint256 public usersArrayIndex;
    address public oldLevelContractAddress;
    address public newLevelContractAddress;
    address public operator;

    enum DumpStage {
        INIT,
        SET_ADDRESSES,
        LEVEL_FIRST_INSTANCE_CREATION_TIME,
        LEVEL_FIRST_COMPLETION_TIME,
        PLAYER_STATS,
        LEVEL_STATS,
        LEVEL_EXISTS_AND_LEVELS_ARRAY_FIX,
        DUMP_DONE
    }

    DumpStage public dumpStage;

    modifier onlyOperator() {
        require(msg.sender == operator, "Only operator account can call this function");
        _;
    }

    event playerScoreProfile(
        address indexed player, uint256 indexed averageCompletionTime, uint256 indexed globalLevelsCompleted
    );

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
        require(msg.sender == ethernaut, "Only Ethernaut can call this function");
        _;
    }

    function initialize(address _ethernautAddress, address _operator) public initializer {
        ethernaut = _ethernautAddress;
    }
    // Protected functions

    function createNewInstance(address instance, address level, address player)
        external
        onlyEthernaut
        levelExistsCheck(level)
    {
        revert("Contract locked due maintenance operations");
    }

    function submitSuccess(address instance, address level, address player)
        external
        onlyEthernaut
        levelExistsCheck(level)
        playerExistsCheck(player)
    {
        revert("Contract locked due maintenance operations");
    }

    function submitFailure(address instance, address level, address player)
        external
        onlyEthernaut
        levelExistsCheck(level)
        playerExistsCheck(player)
    {
        revert("Contract locked due maintenance operations");
    }

    function saveNewLevel(address level) external levelDoesntExistCheck(level) onlyEthernaut {
        levelExists[level] = true;
        levels.push(level);
    }
    // Player specific metrics
    // number of levels created by player

    function getTotalNoOfLevelInstancesCreatedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNoOfInstancesCreatedByPlayer[player];
    }
    // number of levels completed by player

    function getTotalNoOfLevelInstancesCompletedByPlayer(address player)
        public
        view
        playerExistsCheck(player)
        returns (uint256)
    {
        return globalNoOfInstancesCompletedByPlayer[player];
    }
    // number of levels failed by player

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
    // number of failed submissions of a specific level by player (0 if player didn't play the level)

    function getTotalNoOfFailuresForLevelAndPlayer(address level, address player)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        return playerStats[player][level].instance != address(0) ? playerStats[player][level].timeSubmitted.length : 0;
    }
    // Is a specific level completed by a specific player ?

    function isLevelCompleted(address player, address level)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (bool)
    {
        return playerStats[player][level].isCompleted;
    }
    // How much time a player took to complete a level (in seconds)

    function getTimeElapsedForCompletionOfLevel(address player, address level)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        require(levelFirstCompletionTime[player][level] != 0, "Level not completed");
        return levelFirstCompletionTime[player][level] - levelFirstInstanceCreationTime[player][level];
    }
    // Get a specific submission time per level and player
    // Useful to measure differences between submissions time

    function getSubmissionsForLevelByPlayer(address player, address level, uint256 index)
        public
        view
        playerExistsCheck(player)
        levelExistsCheck(level)
        returns (uint256)
    {
        require(playerStats[player][level].timeSubmitted.length >= index, "Index outbounded");
        return playerStats[player][level].timeSubmitted[index];
    }
    // Percentage of total levels completed by player (1e18 = 100%)

    function getPercentageOfLevelsCompleted(address player) public view playerExistsCheck(player) returns (uint256) {
        // Changed from 100 to 1e18 otherwise when levels.length > 100 this will round to 0 always
        return (getTotalNoOfLevelsCompletedByPlayer(player) * 1e18) / levels.length;
    }
    // Function to update the average time elapsed for all player's completed levels on first successful submission

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
        //now, set the average time value in the mapping via evaluating its current value;
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
    // Game specific metrics

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
    // Internal functions

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

    /* Level substituition logic */
    function setOperator(address _operator) public {
        //called through TUP UpgradeAndCall
        require(dumpStage == DumpStage.INIT, "Not correct dump stage");
        usersArrayIndex = 0;
        operator = _operator;
        onMaintenance = true;

        dumpStage = DumpStage.SET_ADDRESSES;
    }

    function setSubstitutionAddresses(address _oldLevelContractAddress, address _newLevelContractAddress)
        public
        onlyOperator
    {
        require(dumpStage == DumpStage.SET_ADDRESSES, "Not correct dump stage");
        require(levelExists[_oldLevelContractAddress], "Address to be superseded is not an existing level");
        require(_newLevelContractAddress != address(0), "New level address can't be 0");
        require(_oldLevelContractAddress != _newLevelContractAddress, "Addesses can't be equal");
        require(_oldLevelContractAddress != levels[levels.length - 1], "Old address can't be last level address");

        oldLevelContractAddress = _oldLevelContractAddress;
        newLevelContractAddress = _newLevelContractAddress;
    }

    function dumpLevelFirstInstanceCreationTime() public onlyOperator {
        require(
            dumpStage == DumpStage.LEVEL_FIRST_INSTANCE_CREATION_TIME || dumpStage == DumpStage.SET_ADDRESSES,
            "Not correct dump stage"
        );

        if (dumpStage == DumpStage.SET_ADDRESSES) {
            dumpStage = DumpStage.LEVEL_FIRST_INSTANCE_CREATION_TIME;
        }

        address _oldLevelContractAddress = oldLevelContractAddress;
        address _newLevelContractAddress = newLevelContractAddress;
        uint256 _usersArrayIndex = usersArrayIndex;

        uint256 timestamp;

        do {
            timestamp = levelFirstInstanceCreationTime[players[_usersArrayIndex]][_oldLevelContractAddress];

            if (timestamp > 0) {
                levelFirstInstanceCreationTime[players[_usersArrayIndex]][_newLevelContractAddress] = timestamp;
                levelFirstInstanceCreationTime[players[_usersArrayIndex]][_oldLevelContractAddress] = 0;
            }

            _usersArrayIndex++;
        } while (gasleft() > 53000 && !(_usersArrayIndex == players.length));

        if (_usersArrayIndex == players.length) {
            dumpStage = DumpStage.LEVEL_FIRST_COMPLETION_TIME;
            usersArrayIndex = 0;
        } else {
            usersArrayIndex = _usersArrayIndex;
        }
    }

    function dumpLevelFirstCompletionTime() public onlyOperator {
        require(dumpStage == DumpStage.LEVEL_FIRST_COMPLETION_TIME, "Not correct dump stage");

        address _oldLevelContractAddress = oldLevelContractAddress;
        address _newLevelContractAddress = newLevelContractAddress;
        uint256 _usersArrayIndex = usersArrayIndex;

        uint256 timestamp;

        do {
            timestamp = levelFirstCompletionTime[players[_usersArrayIndex]][_oldLevelContractAddress];

            if (timestamp > 0) {
                levelFirstCompletionTime[players[_usersArrayIndex]][_newLevelContractAddress] = timestamp;
                levelFirstCompletionTime[players[_usersArrayIndex]][_oldLevelContractAddress] = 0;
            }
            _usersArrayIndex++;
        } while (gasleft() > 53000 && !(_usersArrayIndex == players.length));

        if (_usersArrayIndex == players.length) {
            dumpStage = DumpStage.PLAYER_STATS;
            usersArrayIndex = 0;
        } else {
            usersArrayIndex = _usersArrayIndex;
        }
    }

    function dumpPlayerStats() public onlyOperator {
        require(dumpStage == DumpStage.PLAYER_STATS, "Not correct dump stage");

        address _oldLevelContractAddress = oldLevelContractAddress;
        address _newLevelContractAddress = newLevelContractAddress;
        uint256 _usersArrayIndex = usersArrayIndex;
        LevelInstance memory levelInstanceEmpty;
        LevelInstance memory actualInstance;

        do {
            actualInstance = playerStats[players[_usersArrayIndex]][_oldLevelContractAddress];
            if (actualInstance.instance != address(0)) {
                playerStats[players[_usersArrayIndex]][_newLevelContractAddress].instance = actualInstance.instance;
                playerStats[players[_usersArrayIndex]][_newLevelContractAddress].isCompleted =
                    actualInstance.isCompleted;
                playerStats[players[_usersArrayIndex]][_newLevelContractAddress].timeCreated =
                    actualInstance.timeCreated;
                playerStats[players[_usersArrayIndex]][_newLevelContractAddress].timeCompleted =
                    actualInstance.timeCompleted;
                playerStats[players[_usersArrayIndex]][_newLevelContractAddress].timeSubmitted =
                    actualInstance.timeSubmitted;

                playerStats[players[_usersArrayIndex]][_oldLevelContractAddress] = levelInstanceEmpty;
            }

            _usersArrayIndex++;
        } while (gasleft() > 330000 && !(_usersArrayIndex == players.length));

        if (_usersArrayIndex == players.length) {
            dumpStage = DumpStage.LEVEL_STATS;
            usersArrayIndex = 0;
        }
        {
            usersArrayIndex = _usersArrayIndex;
        }
    }

    function dumpLevelStats() public onlyOperator {
        require(dumpStage == DumpStage.LEVEL_STATS, "Not correct dump stage");

        Level memory levelEmpty;
        levelStats[newLevelContractAddress] = levelStats[oldLevelContractAddress];
        levelStats[oldLevelContractAddress] = levelEmpty;

        dumpStage = DumpStage.LEVEL_EXISTS_AND_LEVELS_ARRAY_FIX;
    }

    function fixLevelExistAndLevelsArray() public onlyOperator {
        require(dumpStage == DumpStage.LEVEL_EXISTS_AND_LEVELS_ARRAY_FIX, "Not correct dump stage");

        address _oldLevelContractAddress = oldLevelContractAddress;

        uint256 deployId = 0;
        while (levels[deployId] != _oldLevelContractAddress) {
            deployId++;
        }
        levels[deployId] = newLevelContractAddress;

        levelExists[_oldLevelContractAddress] = false;
        levels.pop();

        dumpStage = DumpStage.DUMP_DONE;
    }

    function cleanStorage() public onlyOperator {
        require(dumpStage == DumpStage.DUMP_DONE, "Not correct dump stage");
        usersArrayIndex = 0;
        oldLevelContractAddress = address(0);
        newLevelContractAddress = address(0);
        operator = address(0);
        onMaintenance = false;
        dumpStage = DumpStage.INIT;
    }

    // GETTERS USED TO CHECK CHANGED STORAGE SLOTS
    function getPlayerAtIndex(uint256 id) external view returns (address) {
        return players[id];
    }

    function getLevelFirstInstanceCreationTime(address player, address level) public view returns (uint256) {
        return levelFirstInstanceCreationTime[player][level];
    }

    function getLevelFirstCompletionTime(address player, address level) public view returns (uint256) {
        return levelFirstCompletionTime[player][level];
    }

    function getPlayerStats(address player, address level) public view returns (LevelInstance memory) {
        return playerStats[player][level];
    }

    function getLevelStats(address level) public view returns (Level memory) {
        return levelStats[level];
    }

    function getLevelExists(address level) public view returns (bool) {
        return levelExists[level];
    }

    function getLevelAddress(uint256 id) public view returns (address) {
        return levels[id];
    }
    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */

    uint256[44] private __gap;
}
