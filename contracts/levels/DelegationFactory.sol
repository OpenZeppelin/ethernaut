pragma solidity ^0.4.18;

import './base/Level.sol';
import './Delegation.sol';

contract DelegationFactory is Level {

  address delegateAddress;

  function DelegationFactory() {
    delegateAddress = new Delegate(0x0);
  }

  function createInstance(address _player) public payable returns (address) {
    _player;
    Delegation parity = new Delegation(delegateAddress);
    return parity;
  }

  function validateInstance(address _instance, address _player) public view returns (bool) {
    Delegation parity = Delegation(_instance);
    return parity.owner() == _player;
  }
}
