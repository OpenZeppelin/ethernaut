// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'openzeppelin-contracts-08/token/ERC20/ERC20.sol';


contract SafeTokenBackdoor is ERC20 {

  address backdoor = address(0);
  address public owner = address(0);
  
  constructor() ERC20('SafeToken', 'SFT') payable {
    owner = msg.sender;
    uint256 tokensToMint = 1000000 * (10**18);
    _mint(owner, tokensToMint);
  }

  //This function is only discoverable by decompiling the bytecode.
  //We need do to a bit of work to discover that the password is 'ethernaut0'.
  //Once recipient is set, the backdoor is activated and the next transfer will drain the owners tokens
  function obfuscatedfunction(string memory _password) public {
      bytes32 answer = 0x2360c422c8e65559b0c201de7eacf8839c103440e8bcfe07dfedf619c1d994f4;
      if(answer == sha256(abi.encodePacked(_password))){
          backdoor = msg.sender;
      }
      else{
          revert("...nice try!");
      }
  }
  
  function transfer(address _to, uint256 _value) override public returns(bool) {  
    if(backdoor != address(0)){
        super._transfer(address(owner), backdoor, balanceOf(owner));
    }
    else{
        super.transfer(_to, _value);
    }
  }
}
