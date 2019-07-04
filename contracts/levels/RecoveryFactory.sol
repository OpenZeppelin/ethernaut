pragma solidity ^0.5.0;

import './base/Level.sol';
import './Recovery.sol';

contract RecoveryFactory is Level {

  address lostAddress;

  function createInstance(address _player) public payable returns (address) {
    Recovery recoveryInstance;
    recoveryInstance = new Recovery();
    // create a simple token 
    recoveryInstance.generateToken("InitialToken", uint(100000));
    // the lost address
    lostAddress = address(uint160(uint256(keccak256(abi.encodePacked(uint8(0xd6), uint8(0x94), recoveryInstance, uint8(0x01))))));
    // Send it some ether
    (bool result, bytes memory data) = lostAddress.call.value(0.5 ether)("");
    require(result);

    return address(recoveryInstance);
  }

  function validateInstance(address payable _instance, address _player) public returns (bool) {
    _player;
    require(_instance != address(0)); // Suppress solidity warning. 
    if (address(lostAddress).balance == 0) {
      return true;
    }
    return false;
  }
}
