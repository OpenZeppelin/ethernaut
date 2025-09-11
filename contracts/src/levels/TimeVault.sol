// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeVault {
    uint256 public unlockTime;
    uint256 public secretValue;
    bool public isUnlocked;
    address public owner;
    
    event VaultUnlocked(address indexed unlocker, uint256 timestamp);
    event SecretSet(address indexed setter, uint256 value);
    
    constructor() {
        owner = msg.sender;
        // Set unlock time to 1 hour from deployment
        unlockTime = block.timestamp + 1 hours;
        isUnlocked = false;
        secretValue = 0;
    }
    
    modifier onlyAfterUnlockTime() {
        require(block.timestamp >= unlockTime, "Vault is still locked");
        _;
    }
    
    modifier onlyUnlocked() {
        require(isUnlocked, "Vault must be unlocked first");
        _;
    }
    
    // Function to unlock the vault - can only be called after unlock time
    function unlock() external onlyAfterUnlockTime {
        isUnlocked = true;
        emit VaultUnlocked(msg.sender, block.timestamp);
    }
    
    // Function to set the secret value - can only be called when vault is unlocked
    function setSecret(uint256 _secret) external onlyUnlocked {
        secretValue = _secret;
        emit SecretSet(msg.sender, _secret);
    }
    
    // Function to check if the level is completed
    function isCompleted() external view returns (bool) {
        // Level is completed when secret value is set to 42
        return secretValue == 42;
    }
    
    // Helper function to get current timestamp (for testing purposes)
    function getCurrentTime() external view returns (uint256) {
        return block.timestamp;
    }
    
    // Helper function to get time remaining until unlock
    function getTimeRemaining() external view returns (uint256) {
        if (block.timestamp >= unlockTime) {
            return 0;
        }
        return unlockTime - block.timestamp;
    }
}