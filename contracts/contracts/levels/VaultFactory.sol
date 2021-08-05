pragma solidity ^0.6.0;

import './base/Level.sol';
import './Vault.sol';

contract VaultFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    _player;
    bytes32 password = "A very strong secret password :)";
    Vault instance = new Vault(password);
    return address(instance);
  }

  function validateInstance(address payable _instance, address) override public returns (bool) {
    Vault instance = Vault(_instance);
    return !instance.locked();
  }
}
