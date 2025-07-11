// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./ImpersonatorTwo.sol";

contract ImpersonatorTwoFactory is Level {
    bytes public LOCK_SIG =
        hex"7f75c66c45a52c35ead5970bbfaafdfba626a6ddceabc14e0f8a8c7d88a5772b20a9548ceb5e1dfe9262ed26c1817115a7db2673f7465bb5827ed42300a28ae91c";
    bytes public ADMIN_SIG =
        hex"7f75c66c45a52c35ead5970bbfaafdfba626a6ddceabc14e0f8a8c7d88a5772b5c1791efea3c0aafcd1d628a0cde721aa9c039c1636df9a3a76e5694d0fd1d3b1b";

    function createInstance(
        address _player
    ) public payable override returns (address) {
        require(
            msg.value == 0.001 ether,
            "Must send 0.001 ETH to create instance"
        );

        _player;

        ImpersonatorTwo instance = new ImpersonatorTwo{value: msg.value}();
        // Set Bob as owner
        instance.transferOwnership(0x73DAF820f86B79d605A239c26fD80B78f54433BC);
        // Lock the funds
        instance.switchLock(LOCK_SIG);
        // Set Alice as admin by using the signature crafted by Bob
        instance.setAdmin(
            ADMIN_SIG,
            0xAf1F2d124093d2D5C24b6dFf1caeC8f0f8c3Cf95
        );

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
