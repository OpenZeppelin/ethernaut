pragma solidity ^0.4.11;

import './base/Level.sol';
import './Token.sol';

contract TokenFactory is Level {

  uint supply = 21000000;
  uint playerSupply = 20;

  function createInstance(address _player) public payable returns (address) {
    Token token = new Token(supply);
    token.transfer(_player, playerSupply);
    return token;
  }

  function validateInstance(address _instance, address _player) public constant returns (bool) {
    Token token = Token(_instance);
    return token.balanceOf(_player) > playerSupply;
  }
}
