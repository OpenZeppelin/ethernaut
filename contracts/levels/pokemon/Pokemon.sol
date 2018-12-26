pragma solidity ^0.5.0;

contract Pokemon {
    bytes32 public name;
    uint public level;
    
    constructor(bytes32 _name, uint _level) public {
        name = _name;
        level = _level;
    }
}