pragma solidity ^0.5.0;

contract NotPokemon {
    bytes32 public pkmName;
    uint public pkmLevel;
    
    constructor(bytes32 _name, uint _level) public {
        pkmName = _name;
        pkmLevel = _level;
    }
}
