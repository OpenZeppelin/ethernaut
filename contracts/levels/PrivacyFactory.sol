pragma solidity ^0.4.18;

import './base/Level.sol';
import './Privacy.sol';

contract PrivacyFactory is Level {

  function createInstance(address) public payable returns (address) {
    bytes32[3] memory data;
    data[0] = keccak256(tx.origin,"0");
    data[1] = keccak256(tx.origin,"1");
    data[2] = keccak256(tx.origin,"2");
    Privacy instance = new Privacy(data);
    return instance;
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    Privacy instance = Privacy(_instance);
    return instance.locked() == false;
  }
}
