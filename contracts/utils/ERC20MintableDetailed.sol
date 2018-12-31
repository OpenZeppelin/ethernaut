pragma solidity ^0.5.0;

import "./ERC20Mintable.sol";

contract ERC20MintableDetailed is ERC20Mintable {
    string public name;
    string public symbol;
    uint8 public decimals;
    
    constructor (string memory _name, string memory _symbol, uint8 _decimals) ERC20Mintable() public{
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }
}