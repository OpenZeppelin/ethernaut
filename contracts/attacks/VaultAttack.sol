pragma solidity ^0.4.18;

import '../levels/Vault.sol';

contract VaultAttack {

  function attack(address _target) {
    Vault vault = Vault(_target);

    // To get the value below, you will need to manually inspect the blockchain.
    // For example: 
    //
    //
    //
    
    uint256 pin = 46252748491746482866482829472701282746829;

    vault.unlock(pin);
  }
}
