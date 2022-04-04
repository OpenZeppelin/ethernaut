// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import './DoubleEntryPoint.sol';
import './base/Level.sol';

contract DoubleEntryPointFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    // Create legacy token
    LegacyToken oldToken = new LegacyToken();
    // Create a new Forta contract
    Forta forta = new Forta();
    // Create a new CryptoVault
    CryptoVault vault = new CryptoVault(_player);
    // Create latest token
    DoubleEntryPoint newToken = new DoubleEntryPoint(address(oldToken), address(vault), address(forta), _player);
    // Set underlying in CryptoVault
    vault.setUnderlying(address(newToken));
  
    // Activate legacy support to newToken
    oldToken.delegateToNewContract(DelegateERC20(address(newToken)));
    
    // Give CryptoVault some LGT (LegacyTokens)
    oldToken.mint(address(vault), 100 ether);

    return address(newToken);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    DoubleEntryPoint instance = DoubleEntryPoint(_instance);
    Forta forta = instance.forta();

    // If user didn't set an agent, level failed.
    address userAgent = address(forta.usersAgent(_player));
    if(userAgent == address(0)) return false;

    address vault = instance.cryptoVault();
    CryptoVault cryptoVault = CryptoVault(vault);
    try cryptoVault.sweepToken(IERC20(instance.delegatedFrom())) {
      // If it didn't revert, it means no alerts have been raised by the agent. level failed.
      return false;
    } catch {
      // If balance has been swept, level failed.
      if(instance.balanceOf(instance.cryptoVault()) == 0) return false;

      // Otherwise level is completed
      return true;
    }
  }
}
