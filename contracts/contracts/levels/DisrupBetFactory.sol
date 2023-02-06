// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import './DisrupBet.sol';
import './base/Level.sol';

contract DisrupBetFactory is Level {

  function createInstance(address _player) override  public payable returns (address) {
    _player;
    DisrupBet instance = new DisrupBet();
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) override public view returns (bool) {
    DisrupBet instance = DisrupBet(_instance);
    uint256 TotalBets = instance.TeamBets(1);
    return TotalBets > 0 ? true : false;
  }
}
