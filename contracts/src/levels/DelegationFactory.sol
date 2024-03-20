// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./Delegation.sol";

contract DelegationFactory is Level {
    address delegateAddress;

    constructor() {
        Delegate newDelegate = new Delegate(address(0));
        delegateAddress = address(newDelegate);
    }

    function createInstance(address _player) public payable override returns (address) {
        _player;
        Delegation parity = new Delegation(delegateAddress);
        return address(parity);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        Delegation parity = Delegation(_instance);
        return parity.owner() == _player;
    }
}
