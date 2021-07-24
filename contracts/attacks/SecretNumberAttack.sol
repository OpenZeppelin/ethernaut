pragma solidity ^0.6.0;

contract SecretNumberAttack {
    function attack(bytes32 hash) public returns (uint8) {
        uint8 number;
        uint8 secretNumber;
        
        for (number = 0; number <= 256; number++) {
            if (keccak256(abi.encodePacked(number)) == hash) {
                secretNumber = number;
                break;
            }
        }
        
        return secretNumber;
    
    }
}