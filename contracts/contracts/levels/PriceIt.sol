// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract PriceIt {
    IUniswapV2Factory public uniFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
    IUniswapV2Router02 public uniRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    IERC20 public token0;
    IERC20 public token1;
    IERC20 public token2;

    constructor(IERC20 _token0, IERC20 _token1, IERC20 _token2) {
        // You can assume the tokens are sorted, i.e. _token0 < _token1 < _token2. 
        (token0, token1, token2) = (_token0, _token1, _token2);
    }

    function buyToken(uint _inputAmount, IERC20 _inputToken) external {
        uint _outputAmount = getTokenPrice(_inputAmount, _inputToken);
        IERC20 outputToken = _inputToken == token0 ? token1 : token0;
        _inputToken.transferFrom(msg.sender, address(this), _inputAmount);
        outputToken.transfer(msg.sender, _outputAmount);
    }
    
    function getTokenPrice(uint _inputAmount, IERC20 _inputToken) private view returns (uint) {
        IUniswapV2Pair _pair = IUniswapV2Pair(uniFactory.getPair(address(token0), address(token1)));
        (uint res0, uint res1,) = _pair.getReserves();
        if (_inputToken == token0) {
            return uniRouter.getAmountOut(_inputAmount, res0, res1);
        } else if (_inputToken == token1) {
            return uniRouter.getAmountOut(_inputAmount, res1, res0);
        } else {
            revert("Input token is not part of the token0 token1 pair.");
        }
    }
}