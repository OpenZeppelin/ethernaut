// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import './base/Level.sol';
import './Dex.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DexFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    Dex instance = new Dex();
    address instanceAddress = address(instance);
    
    SwappableToken tokenInstance = new SwappableToken(instanceAddress, "Token 1", "TKN1", 110);
    SwappableToken tokenInstanceTwo = new SwappableToken(instanceAddress, "Token 2", "TKN2", 110);
    
    address tokenInstanceAddress = address(tokenInstance);
    address tokenInstanceTwoAddress = address(tokenInstanceTwo);

    instance.setTokens(tokenInstanceAddress, tokenInstanceTwoAddress);
    
    tokenInstance.approve(instanceAddress, 100);
    tokenInstanceTwo.approve(instanceAddress, 100);

    instance.addLiquidity(tokenInstanceAddress, 100);
    instance.addLiquidity(tokenInstanceTwoAddress, 100);

    tokenInstance.transfer(_player, 10);
    tokenInstanceTwo.transfer(_player, 10);

    return instanceAddress;
  }

  function validateInstance(address payable _instance, address) override public returns (bool) {
    address token1 = Dex(_instance).token1();
    address token2 = Dex(_instance).token2();
    return IERC20(token1).balanceOf(_instance) == 0 || ERC20(token2).balanceOf(_instance) == 0;
  }
}
