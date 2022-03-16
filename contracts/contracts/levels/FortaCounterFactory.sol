// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import './FortaCounter.sol';
import './base/Level.sol';

contract FortaCounterFactory is Level {
  mapping(address => address) playerAgent;

  mapping(address => uint256) latestNotifiedValue;

  modifier onlyAgent(address player) {
    require(msg.sender == playerAgent[player], "Not agent");
    _;
  }

  function createInstance(address _player) override public payable returns (address) {
    FortaCounter instance = new FortaCounter(address(this), _player);
    playerAgent[_player] = address(instance.agent());
    

    return address(new CounterProxy(address(instance)));
  }

  function receiveAgentNotification(uint256 value, address player) external onlyAgent(player) {
    latestNotifiedValue[player] = value;
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    FortaCounter instance = FortaCounter(_instance);

    if(latestNotifiedValue[_player] != instance.counter()) {
      delete playerAgent[_player];
      delete latestNotifiedValue[_player];
      return true;
    }

    return false;
  }
}
