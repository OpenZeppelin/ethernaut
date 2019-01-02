pragma solidity ^0.5.0;

import "./pokemon/IPokemonTrainer.sol";
import "./pokemon/NotPokemon.sol";
import "./pokemon/Pokemon.sol";


contract PokemonTrainerValidator {
  bool public p1;
  bool public p2;
  bool public caught;
  
  function submitContract(address submission) public returns (bool){
    address pkm = address(new Pokemon("0x11", 10));
    address notPkm = address(new NotPokemon("0x10", 10));
    
    // solium-disable-next-line security/no-low-level-calls
    (bool canCatchPkm, ) = address(submission).call(abi.encodeWithSignature("catchPokemon(address)", pkm));
    
    // solium-disable-next-line security/no-low-level-calls
    (bool canCatchNotPkm, ) = address(submission).call(abi.encodeWithSignature("catchPokemon(address)", notPkm));
    
    IPokemonTrainer trainer = IPokemonTrainer(submission);
    bool pkmIsCaught = trainer.isCaught(pkm);
    bool notPkmIsCaught = trainer.isCaught(notPkm);
    
    if(canCatchPkm && !canCatchNotPkm && pkmIsCaught && !notPkmIsCaught){
      caught = true;
    }
  }
}