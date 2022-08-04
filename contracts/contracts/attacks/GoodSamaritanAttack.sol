// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Error to simulate (bubble up)
error NotEnoughBalance();

contract GoodSamaritanAttack {
  function notify() external pure {
    revert NotEnoughBalance();
  }
}
