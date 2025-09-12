// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Impersonator, ECLocker} from "src/levels/Impersonator.sol";
import {ImpersonatorFactory} from "src/levels/ImpersonatorFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestImpersonator is Test, Utils {
    Ethernaut ethernaut;
    Impersonator instance;
    address payable owner;
    address payable player;

    bytes32 r = bytes32(uint256(11397568185806560130291530949248708355673262872727946990834312389557386886033));
    bytes32 s = bytes32(uint256(54405834204020870944342294544757609285398723182661749830189277079337680158706));
    uint8 v = 27;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        address payable[] memory users = createUsers(2);

        owner = users[0];
        vm.label(owner, "Owner");

        player = users[1];
        vm.label(player, "Player");

        vm.startPrank(owner);
        ethernaut = getEthernautWithStatsProxy(owner);
        ImpersonatorFactory factory = new ImpersonatorFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = Impersonator(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        ECLocker locker0 = instance.lockers(0);
        assertEq(locker0.lockId(), 1337);
        assertEq(locker0.controller(), 0x42069d82D9592991704e6E41BF2589a76eAd1A91);

        vm.startPrank(player);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    function testTrySameSignatureOpen() public {
        vm.startPrank(player);
        ECLocker locker0 = instance.lockers(0);
        vm.expectRevert();
        locker0.open(v, r, s);
    }

    function testTrySameSignatureChangeController() public {
        vm.startPrank(player);
        ECLocker locker0 = instance.lockers(0);
        vm.expectRevert();
        locker0.changeController(v, r, s, player);
    }

    function testTryRandomSignatureChangeController() public {
        vm.startPrank(player);
        ECLocker locker0 = instance.lockers(0);
        vm.expectRevert();
        locker0.changeController(28, r, bytes32(uint256(s) + 1), player);
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player);
        // https://eips.ethereum.org/EIPS/eip-2
        // flip the s value from s to secp256k1n - s, flip the v value (27 -> 28, 28 -> 27), and the resulting signature would still be valid.
        uint256 secp256k1_n = 115792089237316195423570985008687907852837564279074904382605163141518161494337;
        bytes32 tricked_s = bytes32(secp256k1_n - uint256(s));
     
        vm.expectEmit();
        emit ECLocker.ControllerChanged(address(0), block.timestamp);

        ECLocker locker0 = instance.lockers(0);
        locker0.changeController(28, r, tricked_s, address(0));

        vm.expectEmit();
        emit ECLocker.Open(address(0), block.timestamp);
        locker0.open(0, 0, 0);
        
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
