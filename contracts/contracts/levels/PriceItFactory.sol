// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PriceIt.sol";
import './base/Level.sol';

contract PriceItFactory is Level {
  IUniswapV2Factory public uniFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
  IUniswapV2Router02 public uniRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
  uint amount = 100000 ether;

  function createInstance(address _player) override public payable returns (address) {
    _player;

    TestingERC20 tokenA = new TestingERC20("Token 0", "TZERO");
    TestingERC20 tokenB = new TestingERC20("Token 1", "TONE");
    TestingERC20 tokenC = new TestingERC20("Token 2", "TTWO");
    (TestingERC20 token0, TestingERC20 token1, TestingERC20 token2) = sortTokens(tokenA, tokenB, tokenC);
    PriceIt level = new PriceIt(token0, token1, token2);
    token0.addBalance(address(level), amount);
    token1.addBalance(address(level), amount);
    createPair(token0, token1);
    createPair(token0, token2);
    return address(level);
  }

  function createPair(TestingERC20 _token0, TestingERC20 _token1) internal {
    address pair = uniFactory.createPair(address(_token0), address(_token1));
    _token0.addBalance(address(this), amount);
    _token1.addBalance(address(this), amount);
    _token0.approve(address(uniRouter), amount);
    _token1.approve(address(uniRouter), amount);
    uniRouter.addLiquidity(address(_token0), address(_token1), amount, amount, 
        amount, amount, pair, block.timestamp);
  }

  function sortTokens(TestingERC20 tokenA, TestingERC20 tokenB, TestingERC20 tokenC) private 
    returns(TestingERC20, TestingERC20, TestingERC20) {
    if (tokenA > tokenB) {
      if (tokenA > tokenC) {
        return tokenB > tokenC ? (tokenC, tokenB, tokenA) : (tokenB, tokenC, tokenA);
      } else {
        return tokenB > tokenA ? (tokenA, tokenB, tokenC) : (tokenB, tokenA, tokenC);
      }
    } else {
      if (tokenB > tokenC) {
        return tokenC > tokenA ? (tokenA, tokenC, tokenB) : (tokenC, tokenA, tokenB);
      } else {
        return tokenB > tokenA ? (tokenA, tokenB, tokenC) : (tokenB, tokenA, tokenC);
      }
    }
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    _player;
    return false;
  }
}

contract TestingERC20 is Ownable, ERC20 {
    constructor(string memory _name, string memory _symbol) public Ownable() ERC20(_name, _symbol) {}

    function addBalance(address _address, uint _balance) external onlyOwner {
        _mint(_address, _balance);
    }
}