pragma solidity ^0.4.11;

contract Delegate {

  address public owner;

  function Delegate(address _owner) {
    owner = _owner;
  }

  function pwn() {
    owner = msg.sender;
  }
}

contract Delegation {

  address public owner;
  Delegate delegate;

  function Delegation(address _delegateAddress) {
    delegate = Delegate(_delegateAddress);
    owner = msg.sender;
  }

  function() {
    if(delegate.delegatecall(msg.data)) {
      this;
    }
  }
}
