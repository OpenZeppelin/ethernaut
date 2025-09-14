// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./EllipticToken.sol";

contract EllipticTokenFactory is Level {
    address constant BOB = 0xB0BD214A47c91869AcdaF3BA2dC502C92FF4808c;
    address constant ALICE = 0xA1CE90808eb98D3e2df25813f04EdCF073816dE6;
    uint256 constant INITIAL_AMOUNT = 10 ether;

    function createInstance(address _player) public payable override returns (address) {
        _player;
        EllipticToken instance = new EllipticToken();
        instance.transferOwnership(BOB);

        bytes memory bobSignature =
            hex"97b0393623179f50da2e57bb7f5abdcf58e26cc3314d04bd0252591b57dd0f90221b11fd0817e08a4fc8dd563b60cc29f21fad4b6da47313f6c65e07b09343321c";
        bytes memory aliceSignature =
            hex"a48e68e2c70eda26e2ac699d848f9966096ad42663ed0319f85e5c9196fb779e4762e70bbf25878db33baed25a7bfc7194d134d1d544f86cf87210204fe128f61b";

        instance.redeemVoucher(INITIAL_AMOUNT, ALICE, bobSignature, aliceSignature);

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        _player;
        return EllipticToken(_instance).balanceOf(ALICE) == 0;
    }
}
