pragma solidity ^0.4.18;

import './base/Level.sol';
import './HiJack.sol';

contract HiJackFactory is Level {
  address address1;
  address address2;

  function createInstance(address _player) public payable returns (address) {
    _player;
    address hiJackInstance;
    hiJackInstance = new HiJack();
    // Start from 2 to make it more difficult
    address1 = address(keccak256(uint8(0xd6), uint8(0x94), hiJackInstance, uint8(0x02)));
    // Lets do every second nonce to make it interesting. 
    address2 = address(keccak256(uint8(0xd6), uint8(0x94), hiJackInstance, uint8(0x04)));

    // Set the target addresses 
    HiJack(hiJackInstance).changeTargetAddresses(address1,address2);

    // Send these accounts some ether
    address1.transfer(0.5 ether);
    address2.transfer(0.5 ether);
    return hiJackInstance;
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    _player;
    require(_instance != address(0)); // Suppress solidity warning. 
    if (address1.balance + address2.balance < 1 ether) {
      return true;
    }
    return false;
  }
}
