pragma solidity ^0.6.0;

import './base/Level.sol';
import './Dex.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DexFactory is Level {
  address public token_instance_address;
  address public token_instance_two_address;
  address public dex_address;

  function createInstance(address _player) override public payable returns (address) {
    Dex instance = new Dex();
    dex_address = address(instance);
    SwappableToken token_instance = new SwappableToken("Token 1", "TKN1", 110);
    SwappableToken token_instance_two = new SwappableToken("Token 2", "TKN2", 110);
    token_instance_address = address(token_instance);
    token_instance_two_address = address(token_instance_two);
    
    token_instance.approve(address(instance), 100);
    token_instance_two.approve(address(instance), 100);
    instance.add_liquidity(address(token_instance), 100);
    instance.add_liquidity(address(token_instance_two), 100);
    token_instance.transfer(_player, 10);
    token_instance_two.transfer(_player, 10);
    return address(instance);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    Dex instance = Dex(_instance);
    return ERC20(token_instance_address).balanceOf(dex_address) == 0 || ERC20(token_instance_two_address).balanceOf(dex_address) == 0;
  }
}
