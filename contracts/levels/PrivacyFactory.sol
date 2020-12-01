pragma solidity ^0.6.0;

import './base/Level.sol';
import './Privacy.sol';

contract PrivacyFactory is Level {

  function createInstance(address) override public payable returns (address) {
    bytes32[3] memory data;
    data[0] = keccak256(abi.encodePacked(tx.origin,"0"));
    data[1] = keccak256(abi.encodePacked(tx.origin,"1"));
    data[2] = keccak256(abi.encodePacked(tx.origin,"2"));
    Privacy instance = new Privacy(data);
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    Privacy instance = Privacy(_instance);
    return instance.locked() == false;
  }
}
