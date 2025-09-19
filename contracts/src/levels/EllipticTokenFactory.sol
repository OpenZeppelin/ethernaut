// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./EllipticToken.sol";

contract EllipticTokenFactory is Level {
    address constant BOB = 0xB0B14927389CB009E0aabedC271AC29320156Eb8;
    address constant ALICE = 0xA11CE84AcB91Ac59B0A4E2945C9157eF3Ab17D4e;
    uint256 constant INITIAL_AMOUNT = 10 ether;

    function createInstance(address _player) public payable override returns (address) {
        _player;
        EllipticToken instance = new EllipticToken();
        instance.transferOwnership(BOB);

        bytes memory bobSignature =
            hex"085a4f70d03930425d3d92b19b9d4e37672a9224ee2cd68381a9854bb3673ef86b35cfdeee0fb1d2168587fb188eefb4fe046109af063bf85d9d3d6859ceb4451c";
        bytes memory aliceSignature =
            hex"ab1dcd2a2a1c697715a62eb6522b7999d04aa952ffa2619988737ee675d9494f2b50ecce40040bcb29b5a8ca1da875968085f22b7c0a50f29a4851396251de121c";
        bytes32 salt = keccak256("BOB and ALICE are part of the secret sauce");

        instance.redeemVoucher(INITIAL_AMOUNT, ALICE, salt, bobSignature, aliceSignature);

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        _player;
        return EllipticToken(_instance).balanceOf(ALICE) == 0;
    }
}
