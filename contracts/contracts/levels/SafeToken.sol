// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'openzeppelin-contracts-08/token/ERC20/ERC20.sol';

contract SafeToken is ERC20{

  address public owner = address(0);
  
  constructor() ERC20('SafeToken', 'SFT') {
    owner = msg.sender;
    uint256 tokensToMint = 1000000 * (10**18);
    _mint(owner, tokensToMint);
  }
}
