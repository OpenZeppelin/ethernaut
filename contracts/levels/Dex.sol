pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/math/SafeMath.sol';

contract Dex  {
  using SafeMath for uint;
  address public tkn1;
  address public tkn2;
  constructor(address _tkn1, address _tkn2) public {
    tkn1 = _tkn1;
    tkn2 = _tkn2;
  }

  function swap(address from, address to, uint amount) public {
    require(ERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
    uint swap_amount = get_swap_price(from, to, amount);
    ERC20(from).transferFrom(msg.sender, address(this), amount);
    ERC20(to).approve(address(this), swap_amount);
    ERC20(to).transferFrom(address(this), msg.sender, swap_amount);
  }

  function add_liquidity(address token_address, uint amount) public{
    ERC20(token_address).transferFrom(msg.sender, address(this), amount);
  }

  function get_swap_price(address from, address to, uint amount) public view returns(uint){
    return((amount * ERC20(to).balanceOf(address(this)))/ERC20(from).balanceOf(address(this)));
  }

  function approve(address spender, uint amount) public {
    SwappableToken(tkn1).approve(msg.sender, spender, amount);
    SwappableToken(tkn2).approve(msg.sender, spender, amount);
  }

  function balanceOf(address token, address account) public view returns (uint){
    return ERC20(token).balanceOf(account);
  }
}

contract SwappableToken is ERC20 {
  constructor(string memory name, string memory symbol, uint initialSupply) public ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
  }
  function approve(address owner, address spender, uint amount) public returns(bool){
        super._approve(owner, spender, amount);
    }
}
