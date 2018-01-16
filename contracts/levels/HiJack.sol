pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract HiJack is Ownable {

  //creators lost ether - Our target addresses
  address public address1;
  address public address2;

  //constructor
  function HiJack() public {
    // address1 and address2 each have 0.5 ether. 
  }

  function changeTargetAddresses(address _address1, address _address2) public onlyOwner {
    address1 = _address1;
    address2 = _address2;
  }

  //generate tokens
  function generateToken(string _name, uint256 _initialSupply) public {
  new SimpleToken(_name, _initialSupply, msg.sender);
  }
  
  //change the owner
  function changeOwnership(address _newOwner) onlyOwner public {
    owner = _newOwner;
  }
}

contract SimpleToken is Ownable {
  // public variables
  string public name;
  mapping (address => uint) public balances;

  // constructor
  function SimpleToken(string _name, uint256 _initialSupply, address _owner) public {
    name = _name;
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
