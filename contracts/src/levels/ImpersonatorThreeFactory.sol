// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./ImpersonatorThree.sol";

contract ImpersonatorThreeFactory is Level {
    function createInstance(
        address _player
    ) public payable override returns (address) {
        require(
            msg.value == 0.001 ether,
            "Must send 0.001 ETH to create instance"
        );

        _player;

        ImpersonatorThree instance = new ImpersonatorThree{value: msg.value}();
        // Set Alice as owner
        instance.transferOwnership(0xAf1F2d124093d2D5C24b6dFf1caeC8f0f8c3Cf95);

        return address(instance);
    }

    function validateInstance(
        address payable _instance,
        address _player
    ) public view override returns (bool) {
        _player;
        return _instance.balance == 0;
    }
}
