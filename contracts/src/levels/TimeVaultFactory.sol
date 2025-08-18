// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./TimeVault.sol";

contract TimeVaultFactory is Level {
    function createInstance(address _player) public payable override returns (address) {
        _player; // Unused parameter, silence compiler warning
        
        // Create a new TimeVault instance
        TimeVault instance = new TimeVault();
        
        return address(instance);
    }

    function validateInstance(address payable _instance, address /* _player */) public view override returns (bool) {
        // Cast the instance address to the TimeVault contract
        TimeVault instance = TimeVault(_instance);
        
        // Check if the player has completed the level
        // The level is completed when the secret value is set to 42
        return instance.isCompleted();
    }
}