pragma solidity ^0.4.18;

import './base/Level.sol';
import './Vaultcopy.sol';

contract VaultFactorycopy is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    bytes32 password = "A very strong secret password :)";
    Vaultcopy instance = new Vaultcopy(password);
    return instance;
  }

  function validateInstance(address _instance, address) public returns (bool) {
    Vaultcopy instance = Vaultcopy(_instance);
    return !instance.locked();
  }
}
