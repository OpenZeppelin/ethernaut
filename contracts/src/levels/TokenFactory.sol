// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./base/Level-06.sol";
import "./Token.sol";

contract TokenFactory is Level {
    uint256 supply = 21000000;
    uint256 playerSupply = 20;

    function createInstance(address _player) public payable override returns (address) {
        Token token = new Token(supply);
        token.transfer(_player, playerSupply);
        return address(token);
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        Token token = Token(_instance);
        return token.balanceOf(_player) > playerSupply;
    }
}
