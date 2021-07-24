// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;


contract SecretNumber {
    bytes32 answerHash = 0x763a7e0ee79faefad826c47a503fa6ee5c67f35d622ef6580ba47c2bb991c707;
    
    address public owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function changeOwner(uint8 secretNumber) payable public {
        require(msg.value == 1 ether);
        
        if (keccak256(abi.encodePacked(secretNumber)) == answerHash) {
            owner = msg.sender;
            msg.sender.transfer(1 ether);
        }
    }
}