// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Statistics} from "src/metrics/Statistics.sol";

contract TestLeaderboard is Test {
    Statistics stats;

    Utils utils;

    address payable ethernaut;
    address payable user;
    address payable user2;
    address payable level_factory_1;
    address payable level_factory_2;
    address payable level_factory_3;
    address payable level_instance_1;
    address payable level_instance_2;
    address payable level_instance_3;
    address payable level_instance_4;
    address payable level_instance_5;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        utils = new Utils();
        address payable[] memory users = utils.createUsers(11);

        ethernaut = users[0];
        vm.label(user, "Ethernaut");

        user = users[1];
        vm.label(user, "User");

        user2 = users[2];
        vm.label(user, "User 2");

        level_factory_1 = users[3];
        vm.label(level_factory_1, "Level Factory 1");

        level_factory_2 = users[4];
        vm.label(level_factory_2, "Level Factory 2");

        level_factory_3 = users[5];
        vm.label(level_factory_3, "Level Factory 3");

        level_instance_1 = users[6];
        vm.label(level_instance_1, "Level Instance 1");

        level_instance_2 = users[7];
        vm.label(level_instance_2, "Level Instance 2");

        level_instance_3 = users[8];
        vm.label(level_instance_3, "Level Instance 3");

        level_instance_4 = users[9];
        vm.label(level_instance_3, "Level Instance 4");

        level_instance_5 = users[10];
        vm.label(level_instance_3, "Level Instance 5");

        stats = new Statistics();
        stats.initialize(ethernaut);
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Checks states of multiple levels.
    function testCreationMultipleLevels() public {
        vm.startPrank(ethernaut);
        stats.saveNewLevel(level_factory_1);
        stats.saveNewLevel(level_factory_2);
        stats.saveNewLevel(level_factory_3);

        stats.createNewInstance(level_instance_1, level_factory_1, user);
        stats.createNewInstance(level_instance_2, level_factory_2, user);
        stats.createNewInstance(level_instance_3, level_factory_3, user);
        stats.createNewInstance(level_instance_4, level_factory_1, user2);
        stats.createNewInstance(level_instance_5, level_factory_2, user2);

        assertEq(stats.getTotalNoOfLevelInstancesCreated(), 5);
        assertEq(stats.getTotalNoOfPlayers(), 2);

        stats.submitSuccess(level_instance_1, level_factory_1, user);
        stats.submitSuccess(level_instance_2, level_factory_2, user);
        stats.submitFailure(level_instance_3, level_factory_3, user);
        stats.submitSuccess(level_instance_4, level_factory_1, user2);
        stats.submitFailure(level_instance_5, level_factory_2, user2);

        assertEq(stats.getTotalNoOfLevelInstancesCompleted(), 3);
        assertEq(stats.getTotalNoOfFailedSubmissions(), 2);

        assertEq(stats.getNoOfInstancesForLevel(level_factory_1), 2);
        assertEq(stats.getNoOfInstancesForLevel(level_factory_2), 2);
        assertEq(stats.getNoOfInstancesForLevel(level_factory_3), 1);

        assertEq(stats.getNoOfCompletedSubmissionsForLevel(level_factory_1), 2);
        assertEq(stats.getNoOfCompletedSubmissionsForLevel(level_factory_2), 1);

        assertEq(stats.getNoOfFailedSubmissionsForLevel(level_factory_2), 1);
        assertEq(stats.getNoOfFailedSubmissionsForLevel(level_factory_3), 1);
    }
}
