// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./Shop.sol";

contract ShopFactory is Level {
    function createInstance(address _player) public payable override returns (address) {
        _player;
        Shop _shop = new Shop();
        return address(_shop);
    }

    function validateInstance(address payable _instance, address) public view override returns (bool) {
        Shop _shop = Shop(_instance);
        return _shop.price() < 100;
    }
}
