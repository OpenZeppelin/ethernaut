// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {ImpersonatorTwo} from "src/levels/ImpersonatorTwo.sol";
import {ImpersonatorTwoFactory} from "src/levels/ImpersonatorTwoFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestImpersonatorTwo is Test, Utils {
    Ethernaut ethernaut;
    ImpersonatorTwo instance;

    address payable initializer;
    address payable player;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        address payable[] memory users = createUsers(2);

        initializer = users[0];
        vm.label(initializer, "Initializer");

        player = payable(address(0xF16989b7A9970Ac3a117Ad45b5eCEa6CEF31f208));
        vm.deal(player, 5 ether);
        vm.label(player, "Player");

        vm.startPrank(initializer);
        ethernaut = getEthernautWithStatsProxy(initializer);
        ImpersonatorTwoFactory factory = new ImpersonatorTwoFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = ImpersonatorTwo(payable(createLevelInstance(ethernaut, Level(address(factory)), 0.001 ether)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the initial state of the level and environment.
    function testInit() public {
        vm.startPrank(player);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    function testTrySameSignatureSwitch() public {
        vm.startPrank(player);
        bytes memory signature =
            hex"7f75c66c45a52c35ead5970bbfaafdfba626a6ddceabc14e0f8a8c7d88a5772b20a9548ceb5e1dfe9262ed26c1817115a7db2673f7465bb5827ed42300a28ae91c";

        vm.expectRevert();
        instance.switchLock(signature);
    }

    function testTrySameSignatureAdmin() public {
        vm.startPrank(player);
        bytes memory signature =
            hex"7f75c66c45a52c35ead5970bbfaafdfba626a6ddceabc14e0f8a8c7d88a5772b5c1791efea3c0aafcd1d628a0cde721aa9c039c1636df9a3a76e5694d0fd1d3b1b";

        vm.expectRevert();
        instance.setAdmin(signature, player);
    }

    function testTryRandomSignatureLock() public {
        vm.startPrank(player);
        bytes memory signature =
            hex"0075c66c45a52c35ead5970bbfaafdfba626a6ddceabc14e0f8a8c7d88a5772b5c1791efea3c0aafcd1d628a0cde721aa9c039c1636df9a3a76e5694d0fd1d3b1b";

        vm.expectRevert();
        instance.switchLock(signature);
    }

    function testTryRandomSignatureAdmin() public {
        vm.startPrank(player);
        bytes memory signature =
            hex"0175c66c45a52c35ead5970bbfaafdfba626a6ddceabc14e0f8a8c7d88a5772b5c1791efea3c0aafcd1d628a0cde721aa9c039c1636df9a3a76e5694d0fd1d3b1b";

        vm.expectRevert();
        instance.setAdmin(signature, player);
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player);

        // Signatures generated with ImpersonatorTwo.py script
        bytes memory setAdminSig = abi.encodePacked(
            hex"e5648161e95dbf2bfc687b72b745269fa906031e2108118050aba59524a23c40", // r
            hex"701d59ccb1c72824452441d95444aa250ef592082f0f81957de7c9a7b5c14553", // s
            uint8(28) // v
        );
        bytes memory switchLockSig = abi.encodePacked(
            hex"e5648161e95dbf2bfc687b72b745269fa906031e2108118050aba59524a23c40", // r
            hex"2a04aa67c7760a7bec982fde4b387e1e62dc26ba69dd74444e68ffe28851375e", // s
            uint8(28) // v
        );

        instance.setAdmin(setAdminSig, player);
        instance.switchLock(switchLockSig);
        instance.withdraw();

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
