// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './PriceIt.sol';
import './base/Level.sol';

contract PriceItFactory is Level {
  IUniswapV2Factory private constant uniFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
  IUniswapV2Router02 private constant uniRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
  uint256 private constant amount = 100000 ether;
  TestingERC20 private token0;

  function createInstance(address) public payable override returns (address) {
    token0 = new TestingERC20('Token 0', 'TZERO');
    TestingERC20 token1 = new TestingERC20('Token 1', 'TONE');
    TestingERC20 token2 = new TestingERC20('Token 2', 'TTWO');
    PriceIt level = new PriceIt(token0, token1, token2);
    token0.addBalance(address(level), amount);
    token1.addBalance(address(level), amount);
    createPair(token0, token1);
    createPair(token0, token2);
    return address(level);
  }

  function validateInstance(address payable, address _player) public override returns (bool) {
    return token0.balanceOf(_player) > 9000 ether;
  }

  function createPair(TestingERC20 _token0, TestingERC20 _token1) private {
    address pair = uniFactory.createPair(address(_token0), address(_token1));
    _token0.addBalance(address(this), amount);
    _token1.addBalance(address(this), amount);
    _token0.approve(address(uniRouter), amount);
    _token1.approve(address(uniRouter), amount);
    uniRouter.addLiquidity(address(_token0), address(_token1), amount, amount, amount, amount, pair, block.timestamp);
  }
}

contract TestingERC20 is Ownable, ERC20 {
  constructor(string memory _name, string memory _symbol) public Ownable() ERC20(_name, _symbol) {}

  function addBalance(address _address, uint256 _balance) external onlyOwner {
    _mint(_address, _balance);
  }
}