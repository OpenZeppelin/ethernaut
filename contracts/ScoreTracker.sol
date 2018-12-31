pragma solidity ^0.5.0;

import "./utils/Ownable.sol";
import "./utils/ERC20MintableDetailed.sol";

// Score tracker to use token to track user's score.
contract ScoreTracker is Ownable{
    ERC20MintableDetailed public scoreToken; 
    mapping(address => mapping(address => bool)) public solved;
    mapping(address => uint256) public levelReward;

    constructor() public {
      scoreToken = new ERC20MintableDetailed("ScoreToken", "STKN", 0);
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
        require(levelReward[_level] != 0);
        _;
    }
}