pragma solidity ^0.5.0;

interface IPokemonTrainer {
  function isCaught(address pkm) external returns (bool);
  function catchPokemon(address pkm) external;
}