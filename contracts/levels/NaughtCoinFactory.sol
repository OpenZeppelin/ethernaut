pragma solidity ^0.4.18;

import './base/Level.sol';
import './NaughtCoin.sol';

contract NaughtCoinFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    NaughtCoin instance = new NaughtCoin(_player);
    return instance;
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    NaughtCoin instance = NaughtCoin(_instance);
    return instance.balanceOf(_player) == 0;
  }
}
