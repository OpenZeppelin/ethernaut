## Story

As a newly minted Pokemon trainer, you are now set to start on your journey towards the Pokemon Master title. But first, you've got to learn the difference between a Pokemon and things that look like Pokemon. You certainly do not want to [capture a rice ball](https://bulbapedia.bulbagarden.net/wiki/Ash%27s_Primeape) like Ash!

## Challenge

To complete this challenge, write a smart contract that differentiates a Pokemon and NotPokemon. There are certain properties that make these two look different from each other. 


### Pokemon Contract
```
pragma solidity ^0.5.0;

contract Pokemon {
    bytes32 public name;
    uint public level;
    
    constructor(bytes32 _name, uint _level) public {
        name = _name;
        level = _level;
    }
}
```

### NotPokemon Contract
```
pragma solidity ^0.5.0;

contract NotPokemon {
    bytes32 public pkmName;
    uint public pkmLevel;
    
    constructor(bytes32 _name, uint _level) public {
        pkmName = _name;
        pkmLevel = _level;
    }
}
```

Deploy and submit the contract address of your `PokemonTrainer` contract to the instance via `submitContract(address)` to complete the challenge.

Your smart contract should implement the Pokemon Trainer's Interface, `IPokemonTrainer`, below:

### Pokemon Trainer's Interface
```
pragma solidity ^0.5.0;

interface IPokemonTrainer {
    function isCaught(address pkm) external returns (bool);
    function catchPokemon(address pkm) external;
}
```
