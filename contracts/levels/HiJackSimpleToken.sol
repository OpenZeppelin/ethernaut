// This is used for the HiJack truffle test. 
pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract HiJackSimpleToken is Ownable {
  // Some meta-data 
  string public name;
  uint8 public decimals;

  mapping (address => uint) public balances;

  // constructor
  function SimpleToken(string _name, uint8 _decimals, uint256 _initialSupply, address _owner) public {
    name = _name;
    decimals = _decimals;
    balances[_owner] = _initialSupply;
    owner = _owner; 
  }
 
  // allow transfers of tokens
  function transfer(address _to, uint _amount) public { 
    require(balances[msg.sender] >= _amount);
    balances[msg.sender] -= _amount;
    balances[_to] = _amount;
  }

  // clean up after ourselves
  function destroy() onlyOwner public {
    selfdestruct(owner);
  }

}

