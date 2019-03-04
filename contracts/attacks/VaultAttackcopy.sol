pragma solidity ^0.4.18;

import '../levels/Vaultcopy.sol';

contract VaultAttackcopy {
  function attack(address _target, bytes32 _password) public {
    Vaultcopy vault = Vaultcopy(_target);
    vault.unlock(_password);
  }
}
