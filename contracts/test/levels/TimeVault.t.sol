// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "../utils/Utils.sol";

import {TimeVault} from "../../src/levels/TimeVault.sol";
import {TimeVaultFactory} from "../../src/levels/TimeVaultFactory.sol";
import {Level} from "../../src/levels/base/Level.sol";
import {Ethernaut} from "../../src/Ethernaut.sol";

contract TestTimeVault is Test, Utils {
    Ethernaut ethernaut;
    TimeVault instance;

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
        TimeVaultFactory factory = new TimeVaultFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = TimeVault(payable(createLevelInstance(ethernaut, Level(address(factory)), 0 ether)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the initial state of the level and environment.
    function testInit() public {
        vm.startPrank(player);
        
        // Check initial state
        assertFalse(instance.isUnlocked());
        assertEq(instance.secretValue(), 0);
        assertTrue(instance.unlockTime() > block.timestamp);
        
        // Verify level is not completed yet
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
        
        vm.stopPrank();
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player);
        
        // Get the current unlock time
        uint256 currentUnlockTime = instance.unlockTime();
        
        // Warp time to after unlock time
        vm.warp(currentUnlockTime + 1);
        
        // Unlock the vault
        instance.unlock();
        assertTrue(instance.isUnlocked());
        
        // Set the secret value to 42
        instance.setSecret(42);
        assertEq(instance.secretValue(), 42);
        
        // Verify level is completed
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
        
        vm.stopPrank();
    }
}