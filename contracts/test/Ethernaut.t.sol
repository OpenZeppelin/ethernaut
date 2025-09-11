// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Ethernaut} from "src/Ethernaut.sol";
import {Statistics} from "src/metrics/Statistics.sol";
import {ProxyStats} from "src/proxy/ProxyStats.sol";

import {FallbackFactory} from "src/levels/FallbackFactory.sol";
import {Manufactured} from "src/attacks/Manufactured.sol";

import {DummyFactory} from "src/levels/DummyFactory.sol";
import {Dummy} from "src/levels/Dummy.sol";

contract TestEthernaut is Test {
    Ethernaut ethernaut;
    Statistics stats;

    Utils utils;

    address payable user;
    address payable user2;
    address payable owner;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        utils = new Utils();
        address payable[] memory users = utils.createUsers(3);

        user = users[0];
        vm.label(user, "User 1");

        user2 = users[1];
        vm.label(user, "User 2");

        owner = users[2];
        vm.label(owner, "Owner");

        vm.startPrank(owner);

        ethernaut = new Ethernaut();

        stats = Statistics(address(new ProxyStats(address(new Statistics()), owner, address(ethernaut))));

        ethernaut.setStatistics(address(stats));

        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Should not allow a player to manufacture a solution instance.
    function testManufactureInstance() public {
        vm.startPrank(owner);
        FallbackFactory level = new FallbackFactory();
        ethernaut.registerLevel(level);
        vm.stopPrank();

        vm.startPrank(user);
        assertTrue(stats.doesLevelExist(address(level)));

        // Instead of solving the instance, the player manufactures an instance with the desired state.
        Manufactured instance = new Manufactured();

        vm.expectRevert();
        ethernaut.submitLevelInstance(payable(address(instance)));
    }

    /// @notice Should not allow player A to use player's B instance to complete a level.
    function testUseOtherPlayerInstance() public {
        vm.startPrank(owner);
        DummyFactory level = new DummyFactory();
        ethernaut.registerLevel(level);
        vm.stopPrank();

        vm.startPrank(user);
        assertTrue(stats.doesLevelExist(address(level)));

        vm.recordLogs();
        ethernaut.createLevelInstance(level);
        Vm.Log[] memory entries = vm.getRecordedLogs();

        address instance = address(uint160(uint256(entries[0].topics[2])));
        Dummy dummy = Dummy(instance);

        dummy.setCompleted(true);
        assertTrue(dummy.completed());

        vm.stopPrank();

        vm.prank(user2);
        vm.expectRevert("This instance doesn't belong to the current user");
        ethernaut.submitLevelInstance(payable(instance));
    }

    /// @notice Should not allow a player to generate 2 completion logs with the same instance.
    function testDoubleCompletion() public {
        vm.startPrank(owner);
        DummyFactory level = new DummyFactory();
        ethernaut.registerLevel(level);
        vm.stopPrank();

        vm.startPrank(user);
        assertTrue(stats.doesLevelExist(address(level)));

        vm.recordLogs();
        ethernaut.createLevelInstance(level);
        Vm.Log[] memory entries = vm.getRecordedLogs();

        address instance = address(uint160(uint256(entries[0].topics[2])));
        Dummy dummy = Dummy(instance);

        dummy.setCompleted(true);
        assertTrue(dummy.completed());

        ethernaut.submitLevelInstance(payable(instance));

        assertTrue(stats.isLevelCompleted(user, address(level)));

        vm.expectRevert("Level has been completed already");
        ethernaut.submitLevelInstance(payable(instance));
    }

    /// @notice Should provide instances and verify completion.
    function testLevelCompletion() public {
        vm.startPrank(owner);
        DummyFactory level = new DummyFactory();
        ethernaut.registerLevel(level);
        vm.stopPrank();

        vm.startPrank(user);
        assertTrue(stats.doesLevelExist(address(level)));

        vm.recordLogs();
        ethernaut.createLevelInstance(level);
        Vm.Log[] memory entries = vm.getRecordedLogs();

        address instance = address(uint160(uint256(entries[0].topics[2])));
        Dummy dummy = Dummy(instance);

        dummy.setCompleted(true);
        assertTrue(dummy.completed());

        assertFalse(stats.isLevelCompleted(user, address(level)));
        ethernaut.submitLevelInstance(payable(instance));
        assertTrue(stats.isLevelCompleted(user, address(level)));
    }

    /// @notice Should provide instances and verify non-completion.
    function testLevelNonCompletion() public {
        vm.startPrank(owner);
        DummyFactory level = new DummyFactory();
        ethernaut.registerLevel(level);
        vm.stopPrank();

        vm.startPrank(user);
        assertTrue(stats.doesLevelExist(address(level)));

        vm.recordLogs();
        ethernaut.createLevelInstance(level);
        Vm.Log[] memory entries = vm.getRecordedLogs();

        address instance = address(uint160(uint256(entries[0].topics[2])));
        Dummy dummy = Dummy(instance);

        assertFalse(dummy.completed());
        assertFalse(stats.isLevelCompleted(user, address(level)));
        ethernaut.submitLevelInstance(payable(instance));
        assertFalse(stats.isLevelCompleted(user, address(level)));
    }

    /// @notice Should not provide instances to non-registered level factories.
    function testNonRegisteredLevel() public {
        vm.startPrank(owner);
        DummyFactory level = new DummyFactory();
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert("This level doesn't exists");
        ethernaut.createLevelInstance(level);

        assertFalse(stats.doesLevelExist(address(level)));
    }

    /// @notice Should not allow anyone but the owner to upload a level.
    function testUploadLevel() public {
        DummyFactory level = new DummyFactory();
        vm.expectRevert("Ownable: caller is not the owner");
        ethernaut.registerLevel(level);
    }
}
