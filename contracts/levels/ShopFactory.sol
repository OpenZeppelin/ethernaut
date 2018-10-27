pragma solidity 0.4.24;

import './base/Level.sol';
import './Shop.sol';

contract ShopFactory is Level {

  function createInstance(address _player) public payable returns (address) {
    _player;
    Shop _shop = new Shop();
    return _shop;
  }

  function validateInstance(address _instance, address) public returns (bool) {
    Shop _shop = Shop(_instance);
    return _shop.price() < 100;
  }

}
