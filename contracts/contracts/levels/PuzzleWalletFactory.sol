pragma solidity ^0.6.0;

import './base/Level.sol';
import './PuzzleWallet.sol';

contract PuzzleWalletFactory is Level {

  function createInstance(address /*_player*/) override public payable returns (address) {
    require(msg.value == 1 ether, "Must send 1 ETH to create instance");

    PuzzleWallet puzzle = new PuzzleWallet();
    puzzle.addToWhitelist(address(this));
    puzzle.deposit{value: 5 ether}();

    return address(puzzle);
  }

  function validateInstance(address payable _instance, address /*_player*/) override public returns (bool) {
    return _instance.balance == 0;
  }
}
