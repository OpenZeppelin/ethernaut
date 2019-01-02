pragma solidity ^0.5.0;

import "./ERC20Mintable.sol";

contract UnspendableToken is ERC20Mintable {
    string public name;
    string public symbol;
    uint8 public decimals;

    constructor (
      string memory _name,
      string memory _symbol,
      uint8 _decimals
    ) ERC20Mintable() public{
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function transfer(address to, uint256 value) public returns (bool) {
       revert();
    }

    function approve(address spender, uint256 value) public returns (bool) {
      revert();
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        revert();
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        revert();
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        revert();
    }
}