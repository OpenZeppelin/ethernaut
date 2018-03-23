pragma solidity ^0.4.18;

import './base/Level.sol';
import './Vault.sol';

contract VaultFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    bytes32 password = "A very strong secret password :)";
    Vault instance = new Vault(password);
    return instance;
  }

  function validateInstance(address _instance, address _player) public view returns (bool) {
    Vault instance = Vault(_instance);
    return !instance.locked();
  }
}
