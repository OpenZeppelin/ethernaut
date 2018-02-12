pragma solidity ^0.4.18;

import './base/Level.sol';
import './Vault.sol';

contract VaultFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    uint256 pin = 46252748491746482866482829472701282746829;
    Vault instance = new Vault(pin);
    return instance;
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    Vault instance = Vault(_instance);
    return instance.isUnlocked();
  }
}