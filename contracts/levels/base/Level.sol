pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Level is Ownable {
  function createInstance(address _player) public payable returns (address);
  function validateInstance(address _instance, address _player) public constant returns (bool);
}
