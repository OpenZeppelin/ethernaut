// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./base/Level.sol";
import "./ImpersonatorTwo.sol";

contract ImpersonatorTwoFactory is Level {
    bytes public SWITCH_LOCK_SIG = abi.encodePacked(
        hex"e5648161e95dbf2bfc687b72b745269fa906031e2108118050aba59524a23c40", // r
        hex"70026fc30e4e02a15468de57155b080f405bd5b88af05412a9c3217e028537e3", // s
        uint8(27) // v
    );
    bytes public SET_ADMIN_SIG = abi.encodePacked(
        hex"e5648161e95dbf2bfc687b72b745269fa906031e2108118050aba59524a23c40", // r
        hex"4c3ac03b268ae1d2aca1201e8a936adf578a8b95a49986d54de87cd0ccb68a79", // s
        uint8(27) // v
    );

    address constant OWNER = 0x03E2cf81BBE61D1fD1421aFF98e8605a5A9e953a;
    address constant ADMIN = 0xADa4aFfe581d1A31d7F75E1c5a3A98b2D4C40f68;

    function createInstance(address _player) public payable override returns (address) {
        require(msg.value == 0.001 ether, "Must send 0.001 ETH to create instance");

        _player;

        ImpersonatorTwo instance = new ImpersonatorTwo{value: msg.value}();
        // Set Bob as owner
        instance.transferOwnership(OWNER);
        // Lock the funds
        instance.switchLock(SWITCH_LOCK_SIG);
        // Set Alice as admin by using the signature crafted by Bob
        instance.setAdmin(SET_ADMIN_SIG, ADMIN);

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        _player;
        return _instance.balance == 0;
    }
}
