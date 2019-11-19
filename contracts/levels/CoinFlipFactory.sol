pragma solidity ^0.5.0;

import './base/Level.sol';
import './CoinFlip.sol';

contract CoinFlipFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return address(new CoinFlip());
  }

  function validateInstance(address payable _instance, address) public returns (bool) {
    CoinFlip instance = CoinFlip(_instance);
    return instance.consecutiveWins() >= 10;
  }
}
