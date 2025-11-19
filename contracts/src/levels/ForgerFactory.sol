// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./Forger.sol";

contract ForgerFactory is Level {
    function createInstance(address _player) public payable override returns (address) {
        _player;
        return address(new Forger());
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        _player;
        Forger instance = Forger(_instance);
        return instance.totalSupply() > 100 ether;
    }
}
