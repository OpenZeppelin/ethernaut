// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import './base/Level.sol';
import './King.sol';

contract KingFactory is Level {

  uint public insertCoin = 1 ether;

  function createInstance(address _player) override public payable returns (address) {
    _player;
    require(msg.value >= insertCoin);
    return address((new King){value:msg.value}());
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player;
    King instance = King(_instance);
    (bool result,) = address(instance).call.gas(21_000).value(0)("");
    !result;
    return instance._king() != address(this);
  }

  receive() external payable {}

}
