// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import './DoubleEntry.sol';
import './base/Level.sol';
import '@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol';

contract DoubleEntryFactory is Level {
  mapping(address => address) playerAgent;

  mapping(address => uint256) latestNotifiedValue;

  modifier onlyAgent(address player) {
    require(msg.sender == playerAgent[player], "Not agent");
    _;
  }

  function createInstance(address _player) override public payable returns (address) {
    // Create legacy and latest token
    LegacyToken oldToken = new LegacyToken();
    DoubleEntry newToken = new DoubleEntry();

    // Create a new Agent with the newToken as allowed emissor
    Agent agent = new Agent(address(newToken));

    // Assign agent to player on mapping
    playerAgent[_player] = address(newToken.fortaAgent());

    // Put the new tokens behing a proxy where the player is the admin (it can upgrade)
    TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(address(newToken), _player, bytes(""));
    DoubleEntry proxiedToken = DoubleEntry(address(proxy));
    DEX dex = new DEX(_player, address(proxy));
    
    // Activate legacy support to newToken
    oldToken.delegateToNewContract(DelegateERC20(address(proxy)));
    
    // Give DEX some LGT (LegactyTokens)
    oldToken.mint(address(dex), 100 ether);

    // Initialize
    // Notice that the initialize function will mint 100 LTT (DoubleEntry token) to the DEX
    proxiedToken.initialize(address(oldToken), address(dex), address(agent), _player);

    return address(proxy);
  }

  function receiveAgentNotification(uint256 value, address player) external onlyAgent(player) {
    latestNotifiedValue[player] = value;
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    DoubleEntry instance = DoubleEntry(_instance);

    if(
      latestNotifiedValue[_player] != instance.delegatedCalls() &&
      instance.balanceOf(instance.dex()) == 0
    ) {
      delete playerAgent[_player];
      delete latestNotifiedValue[_player];
      return true;
    }

    return false;
  }
}
