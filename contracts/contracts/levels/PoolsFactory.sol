// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import './base/Level.sol';

contract PoolsFactory is Level {

  address private _uniswapFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

function createInstance(address _player) override public payable returns (address) {
    _player;
    return address(0);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player;
    return true;
  }
}
