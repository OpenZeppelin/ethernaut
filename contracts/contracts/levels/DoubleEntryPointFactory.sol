// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import './DoubleEntryPoint.sol';
import './base/Level.sol';
import '@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol';

contract DoubleEntryPointFactory is Level {
  mapping(address => address) playerAgent;

  mapping(address => bool) triggerPause;

  modifier onlyAgent(address player) {
    require(msg.sender == playerAgent[player], "Not agent");
    _;
  }

  function createInstance(address _player) override public payable returns (address) {
    // Create Legacy and DoubleEntryPoint token
    LegacyToken oldToken = new LegacyToken();
    oldToken.initialize();
    DoubleEntryPoint newToken = new DoubleEntryPoint();

    // Create a new Agent
    Agent agent = new Agent();

    // Put the new tokens behing a proxy where the player is the admin (it can upgrade)
    TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(address(newToken), _player, bytes(""));
    DoubleEntryPoint proxiedToken = DoubleEntryPoint(address(proxy));
    CryptoVault vault = new CryptoVault(_player, address(proxy));
    
    // Activate legacy support to newToken
    oldToken.delegateToNewContract(DelegateERC20(address(proxy)));
    
    // Give CryptoVault some LGT (LegacyTokens)
    oldToken.mint(address(vault), 100 ether);

    // Initialize
    // Notice that the initialize function will mint 100 DET (DoubleEntryPoint token) to the CryptoVault
    proxiedToken.initialize(address(oldToken), address(vault), address(agent), _player);

    // Assign agent to player on mapping
    playerAgent[_player] = address(proxiedToken.fortaAgent());

    // Set emissor on agent
    agent.setEmissor(address(proxy));

    return address(proxy);
  }

  function receiveAgentNotification(address player) external onlyAgent(player) {
    triggerPause[player] = true;
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    DoubleEntryPoint instance = DoubleEntryPoint(_instance);

    if(
      triggerPause[_player] &&
      instance.balanceOf(instance.cryptoVault()) == 0
    ) {
      delete playerAgent[_player];
      delete triggerPause[_player];
      return true;
    }

    return false;
  }
}
