pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract SafeToken is ERC20{

  address public owner = address(0);
  
  constructor() 
  ERC20('SafeToken', 'SFT')
  public {
    owner = msg.sender;
    uint256 tokensToMint = 1000000 * (10**18);
    _mint(owner, tokensToMint);
  }


}
