// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./UniqueNFT.sol";

contract UniqueNFTFactory is Level {

    function createInstance(address _player) public payable override returns (address) {
        _player;
        return address((new UniqueNFT)());
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        _player;
        UniqueNFT instance = UniqueNFT(_instance);
        return instance.balanceOf(_player) > 1;
    }
}
