pragma solidity ^0.6.0;

import './base/Level.sol';
import './PrivateKey.sol';

contract PrivateKeyFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    PrivateKey privateKeyInstance = new PrivateKey(0xb448c6a45ef4a29d27d7f9321e706413f210dfa2e9c711ac79de74c2b67e5840);
    return address(privateKeyInstance);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    PrivateKey privateKeyInstance = PrivateKey(_instance);
    return privateKeyInstance.owner() == _player;
  }
}