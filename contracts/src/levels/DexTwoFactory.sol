// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./DexTwo.sol";
import "openzeppelin-contracts-08/token/ERC20/ERC20.sol";

contract DexTwoFactory is Level {
    function createInstance(address _player) public payable override returns (address) {
        DexTwo instance = new DexTwo();
        address instanceAddress = address(instance);

        SwappableTokenTwo tokenInstance = new SwappableTokenTwo(instanceAddress, "Token 1", "TKN1", 110);
        SwappableTokenTwo tokenInstanceTwo = new SwappableTokenTwo(instanceAddress, "Token 2", "TKN2", 110);

        address tokenInstanceAddress = address(tokenInstance);
        address tokenInstanceTwoAddress = address(tokenInstanceTwo);

        instance.setTokens(tokenInstanceAddress, tokenInstanceTwoAddress);

        tokenInstance.approve(instanceAddress, 100);
        tokenInstanceTwo.approve(instanceAddress, 100);

        instance.add_liquidity(tokenInstanceAddress, 100);
        instance.add_liquidity(tokenInstanceTwoAddress, 100);

        tokenInstance.transfer(_player, 10);
        tokenInstanceTwo.transfer(_player, 10);

        return instanceAddress;
    }

    function validateInstance(address payable _instance, address) public view override returns (bool) {
        address token1 = DexTwo(_instance).token1();
        address token2 = DexTwo(_instance).token2();
        return IERC20(token1).balanceOf(_instance) == 0 && ERC20(token2).balanceOf(_instance) == 0;
    }
}
