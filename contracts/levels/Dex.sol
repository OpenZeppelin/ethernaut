pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/math/SafeMath.sol';
import "hardhat/console.sol";

contract Dex  {
  using SafeMath for uint;
  constructor() public {
  }

  function swap(address from, address to, uint256 amount) public {
    require(ERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
    uint swap_amount = get_swap_price(from, to, amount);

    ERC20(from).transferFrom(msg.sender, address(this), amount);
    ERC20(to).approve(address(this), swap_amount);
    ERC20(to).transferFrom(address(this), msg.sender, swap_amount);
  }

  function add_liquidity(address token_address, uint256 amount) public{
    ERC20(token_address).transferFrom(msg.sender, address(this), amount);
  }

  function get_swap_price(address from, address to, uint amount) public view returns(uint){
    return((amount * ERC20(to).balanceOf(address(this)))/ERC20(from).balanceOf(address(this)));
  }
}


contract SwappableToken is ERC20 {
  constructor(string memory name, string memory symbol, uint initialSupply) public ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}
