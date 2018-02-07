pragma solidity ^0.4.18;

import './base/Level.sol';
import './CoinFlip.sol';

contract CoinFlipFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    return new CoinFlip();
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    CoinFlip instance = CoinFlip(_instance);
    return instance.consecutiveWins() >= 10;
  }
}
