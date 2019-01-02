pragma solidity ^0.5.0;

import "./utils/Ownable.sol";
import "./utils/UnspendableToken.sol";

// Score tracker to use token to track user's score.
contract ScoreTracker is Ownable{
  UnspendableToken public scoreToken; 
  mapping(address => mapping(address => bool)) public solved;
  mapping(address => uint256) public levelReward;

  constructor(string memory _tokenName, string memory _tokenSymbol) public {
    scoreToken = new UnspendableToken(_tokenName, _tokenSymbol, 0);
  }

  function registerLevel(address _level, uint256 _reward) public onlyOwner {
    if(levelReward[_level] == 0){
      levelReward[_level] = _reward;
    }
  }
  
  function levelCompleted(address _player, address _level) public onlyOwner {
    if(!solved[_player][_level]){
      solved[_player][_level] = true;
      levelCompletedReward(_player, _level);
    }
  }
  
  function levelCompletedReward(address _player, address _level) internal hasReward(_level){
    scoreToken.mint(_player, levelReward[_level]);
  }

  modifier hasReward(address _level) {
    require(levelReward[_level] != 0, "Rewards is not available for this level");
    _;
  }
}