pragma solidity ^0.6.0;

import './base/Level.sol';
import './DexTwo.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DexTwoFactory is Level {

  function createInstance(address _player) override public payable returns (address) {
    SwappableTokenTwo token_instance = new SwappableTokenTwo("Token 1", "TKN1", 110);
    SwappableTokenTwo token_instance_two = new SwappableTokenTwo("Token 2", "TKN2", 110);
    address token_instance_address = address(token_instance);
    address token_instance_two_address = address(token_instance_two);
    DexTwo instance = new DexTwo(token_instance_address, token_instance_two_address);
    
    token_instance.approve(address(instance), 100);
    token_instance_two.approve(address(instance), 100);
    instance.add_liquidity(address(token_instance), 100);
    instance.add_liquidity(address(token_instance_two), 100);
    token_instance.transfer(_player, 10);
    token_instance_two.transfer(_player, 10);
    return address(instance);
  }

  function validateInstance(address payable _instance, address) override public returns (bool) {
    address token1 = DexTwo(_instance).token1();
    address token2 = DexTwo(_instance).token2();
    return IERC20(token1).balanceOf(_instance) == 0 && ERC20(token2).balanceOf(_instance) == 0;
  }
}
