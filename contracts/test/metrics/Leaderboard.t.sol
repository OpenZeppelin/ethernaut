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
    address payable level_factory_1;
    address payable level_factory_2;
    address payable level_factory_3;
    address payable level_instance_1;
    address payable level_instance_2;
    address payable level_instance_3;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        utils = new Utils();
        address payable[] memory users = utils.createUsers(8);

        ethernaut = users[0];
        vm.label(user, "Ethernaut");

        user = users[1];
        vm.label(user, "User");

        level_factory_1 = users[2];
        vm.label(level_factory_1, "Level Factory 1");

        level_factory_2 = users[3];
        vm.label(level_factory_2, "Level Factory 2");

        level_factory_3 = users[4];
        vm.label(level_factory_3, "Level Factory 3");

        level_instance_1 = users[5];
        vm.label(level_instance_1, "Level Instance 1");

        level_instance_2 = users[6];
        vm.label(level_instance_2, "Level Instance 2");

        level_instance_3 = users[7];
        vm.label(level_instance_3, "Level Instance 3");

        stats = new Statistics();
        stats.initialize(address(ethernaut));

        vm.startPrank(ethernaut);

        stats.saveNewLevel(level_factory_1);
        stats.saveNewLevel(level_factory_2);
        stats.saveNewLevel(level_factory_3);

        stats.createNewInstance(level_instance_1, level_factory_1, user);
        vm.warp(block.timestamp + 9);
        stats.submitSuccess(level_instance_1, level_factory_1, user);

        stats.createNewInstance(level_instance_2, level_factory_2, user);
        vm.warp(block.timestamp + 19);
        stats.submitSuccess(level_instance_2, level_factory_2, user);

        stats.createNewInstance(level_instance_3, level_factory_3, user);
        vm.warp(block.timestamp + 14);
        stats.submitSuccess(level_instance_3, level_factory_3, user);
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the retrieval of time taken to complete levels.
    function testGetTimeTaken() public {
        uint256 time1 = stats.getTimeElapsedForCompletionOfLevel(user, level_factory_1);
        uint256 time2 = stats.getTimeElapsedForCompletionOfLevel(user, level_factory_2);
        uint256 time3 = stats.getTimeElapsedForCompletionOfLevel(user, level_factory_3);

        assertEq(time1, 9);
        assertEq(time2, 19);
        assertEq(time3, 14);
    }

    /// @notice Tests calculation of average time taken to complete level.
    function testGetAverageTimeTaken() public {
        uint256 time1 = stats.getTimeElapsedForCompletionOfLevel(user, level_factory_1);
        uint256 time2 = stats.getTimeElapsedForCompletionOfLevel(user, level_factory_2);
        uint256 time3 = stats.getTimeElapsedForCompletionOfLevel(user, level_factory_3);

        uint256 average = stats.getAverageTimeTakenToCompleteLevels(user);
        assertEq(average, (time1 + time2 + time3) / 3);
    }
}
