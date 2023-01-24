// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v2-core/contracts/UniswapV2Pair.sol";
import "./PriceIt.sol";
import "./base/Level.sol";

contract PriceItFactory is Level {
  IUniswapV2Factory private constant uniFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
  IUniswapV2Router02 private constant uniRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
  uint256 private constant amount = 100000 ether;

  function createInstance(address) public payable override returns (address) {
    TestingERC20 token0 = new TestingERC20("Token 0", "TZERO");
    TestingERC20 token1 = new TestingERC20("Token 1", "TONE");
    TestingERC20 token2 = new TestingERC20("Token 2", "TTWO");
    PriceIt level = new PriceIt(token0, token1, token2);
    token0.mint(address(level), amount);
    token1.mint(address(level), amount);
    createPair(token0, token1);
    createPair(token0, token2);
    return address(level);
  }

  function validateInstance(address payable _instance, address _player) public override returns (bool) {
    IERC20 token0 = PriceIt(_instance).token0();
    return token0.balanceOf(_player) > 9000 ether;
  }

  function createPair(TestingERC20 _token0, TestingERC20 _token1) private {
    address pair = uniFactory.createPair(address(_token0), address(_token1));
    _token0.mint(address(this), amount);
    _token1.mint(address(this), amount);
    _token0.approve(address(uniRouter), amount);
    _token1.approve(address(uniRouter), amount);
    uniRouter.addLiquidity(address(_token0), address(_token1), amount, amount, amount, amount, pair, block.timestamp);
  }
}

contract TestingERC20 is Ownable, ERC20 {
  constructor(string memory _name, string memory _symbol) public Ownable() ERC20(_name, _symbol) {}

  function mint(address account, uint256 amount) external onlyOwner {
    _mint(account, amount);
  }
}

contract MockedUniswapV2Factory {
  mapping(address => mapping(address => address)) public getPair;

  function createPair(address tokenA, address tokenB) external returns (address pair) {
    require(tokenA != tokenB, "UniswapV2: IDENTICAL_ADDRESSES");
    (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), "UniswapV2: ZERO_ADDRESS");
    require(getPair[token0][token1] == address(0), "UniswapV2: PAIR_EXISTS");
    bytes memory bytecode = type(UniswapV2Pair).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(token0, token1));
    assembly {
      pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
    IUniswapV2Pair(pair).initialize(token0, token1);
    getPair[token0][token1] = pair;
    getPair[token1][token0] = pair;
    return pair;
  }
}

contract MockedUniswapV2Router {
  address public immutable override factory;

  modifier ensure(uint256 deadline) {
    require(deadline >= block.timestamp, "UniswapV2Router: EXPIRED");
    _;
  }

  constructor(address _factory) public {
    factory = _factory;
  }

  function addLiquidity(
    IERC20 tokenA,
    IERC20 tokenB,
    uint256 amountADesired,
    uint256 amountBDesired,
    uint256 amountAMin,
    uint256 amountBMin,
    address to,
    uint256 deadline
  ) external virtual override ensure(deadline) {
    address pair = IUniswapV2Factory(factory).getPair(tokenA, tokenB);
    tokenA.transferFrom(msg.sender, pair, amountADesired);
    tokenB.transferFrom(msg.sender, pair, amountADesired);
    liquidity = IUniswapV2Pair(pair).mint(to);
  }

  function getAmountOut(
    uint256 amountIn,
    uint256 reserveIn,
    uint256 reserveOut
  ) public pure virtual override returns (uint256 amountOut) {
    require(amountIn > 0, "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT");
    require(reserveIn > 0 && reserveOut > 0, "UniswapV2Library: INSUFFICIENT_LIQUIDITY");
    uint256 amountInWithFee = amountIn.mul(997);
    uint256 numerator = amountInWithFee.mul(reserveOut);
    uint256 denominator = reserveIn.mul(1000).add(amountInWithFee);
    amountOut = numerator / denominator;
  }
}
