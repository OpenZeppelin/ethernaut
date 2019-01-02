pragma solidity ^0.5.0;

import "./base/Level.sol";
import "./PokemonTrainerValidator.sol";

contract PokemonTrainerValidatorFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    PokemonTrainerValidator instance = new PokemonTrainerValidator();
    return address(instance);
  }

  function validateInstance(address _instance, address _player) public returns (bool) {
    _player;
    PokemonTrainerValidator instance = PokemonTrainerValidator(_instance);
    return instance.caught();
  }
}
