// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;


contract PrivateKey {
    
    bytes32 private privateKey;
    address public owner;
    
    constructor(bytes32 _privateKey) public {
        privateKey = _privateKey;
        owner = msg.sender;
    }

    function getOwnership(bytes32 _privateKey) public {
        require(_privateKey == privateKey, "Invalid Private Key");
        owner = msg.sender;
    }
    
}