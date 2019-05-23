pragma solidity ^0.5.0;

import './base/Level.sol';
import './Delegation.sol';

contract DelegationFactory is Level {

  address delegateAddress;

  constructor() public {
    Delegate newDelegate = new Delegate(address(0));
    delegateAddress = address(newDelegate);
  }

  function createInstance(address _player) public payable returns (address) {
    _player;
    Delegation parity = new Delegation(delegateAddress);
    return address(parity);
  }

  function validateInstance(address payable _instance, address _player) public returns (bool) {
    Delegation parity = Delegation(_instance);
    return parity.owner() == _player;
  }
}
