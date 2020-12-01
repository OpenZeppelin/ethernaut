pragma solidity ^0.5.0;

import '../../helpers/Ownable-05.sol';

contract Level is Ownable {
  function createInstance(address _player) public payable returns (address);
  function validateInstance(address payable _instance, address _player) public returns (bool);
}
