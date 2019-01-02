pragma solidity ^0.5.0;

import './levels/base/Level.sol';
import './utils/Ownable.sol';
import './ScoreTracker.sol';

contract Ethernaut is Ownable {
  struct EmittedInstanceData {
    address player;
    Level level;
    bool completed;
  }

  mapping(address => bool) public registeredLevels;
  mapping(address => EmittedInstanceData) public emittedInstances;
  ScoreTracker public scoreTracker;

  event LevelInstanceCreatedLog(address indexed player, address instance);
  event LevelCompletedLog(address indexed player, Level level);

  constructor(string memory _tokenName, string memory _tokenSymbol) public {
    scoreTracker = new ScoreTracker(_tokenName, _tokenSymbol);
  }

  function registerLevel(Level _level, uint256 _reward) public onlyOwner {
    registeredLevels[address(_level)] = true;
    scoreTracker.registerLevel(address(_level), _reward);
  }

  function createLevelInstance(Level _level) public payable {

    // Ensure level is registered.
    require(registeredLevels[address(_level)]);

    // Get level factory to create an instance.
    address instance = _level.createInstance.value(msg.value)(msg.sender);

    // Store emitted instance relationship with player and level.
    emittedInstances[instance] = EmittedInstanceData(msg.sender, _level, false);

    // Retrieve created instance via logs.
    emit LevelInstanceCreatedLog(msg.sender, instance);
  }

  function submitLevelInstance(address _instance) public {

    // Get player and level.
    EmittedInstanceData storage data = emittedInstances[_instance];
    require(data.player == msg.sender); // instance was emitted for this player
    require(data.completed == false); // not already submitted

    // Have the level check the instance.
    if(data.level.validateInstance(_instance, msg.sender)) {

      // Register instance as completed.
      data.completed = true;

      // Notify success via logs.
      emit LevelCompletedLog(msg.sender, data.level);

      // Notify score tracker of completed level
      scoreTracker.levelCompleted(msg.sender, address(data.level));
    }
  }
}