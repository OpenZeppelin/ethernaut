pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/Ownable.sol';

abstract contract Level is Ownable {
  function createInstance(address _player) public payable returns (address);
  function validateInstance(address payable _instance, address _player) public returns (bool);
}
