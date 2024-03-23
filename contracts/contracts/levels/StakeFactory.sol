// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './base/Level.sol';
import './Stake.sol';

import "openzeppelin-contracts-08/token/ERC20/ERC20.sol";

contract StakeFactory is Level {
  address _dweth = address(new ERC20("DummyWETH","DWETH"));
  function createInstance(address _player) override public payable returns (address) {
    return address(new Stake(address(_dweth)));
  }

  function validateInstance(address payable _instance, address _player) override public view returns (bool) {
    Stake instance = Stake(_instance);
    return _instance.balance == 0 && instance.totalStaked() > 0 && _player.balance > 0;
  }
}
