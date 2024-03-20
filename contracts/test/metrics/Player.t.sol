// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Statistics} from "src/metrics/Statistics.sol";

contract TestPlayer is Test {
    Statistics stats;

    Utils utils;

    address payable ethernaut;
    address payable user;
    address payable user2;
    address payable user3;
    address payable level_factory_1;
    address payable level_factory_2;
    address payable level_instance_1;
    address payable level_instance_2;
    address payable level_instance_3;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        utils = new Utils();
        address payable[] memory users = utils.createUsers(9);

        ethernaut = users[0];
        vm.label(user, "Ethernaut");

        user = users[1];
        vm.label(user, "User");

        user2 = users[2];
        vm.label(user, "User 2");

        user3 = users[3];
        vm.label(user, "User 3");

        level_factory_1 = users[4];
        vm.label(level_factory_1, "Level Factory 1");

        level_factory_2 = users[5];
        vm.label(level_factory_2, "Level Factory 2");

        level_instance_1 = users[6];
        vm.label(level_instance_1, "Level Instance 1");

        level_instance_2 = users[7];
        vm.label(level_instance_2, "Level Instance 2");

        level_instance_3 = users[8];
        vm.label(level_instance_3, "Level Instance 3");

        stats = new Statistics();
        stats.initialize(ethernaut);
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Add new level factory.
    function testLevel() public {
        vm.startPrank(ethernaut);
        stats.saveNewLevel(level_factory_1);
        assertTrue(stats.doesLevelExist(level_factory_1));

        vm.expectRevert("Level already exists");
        stats.saveNewLevel(level_factory_1);

        stats.createNewInstance(level_instance_1, level_factory_1, user);
        assertTrue(stats.doesPlayerExist(user));

        vm.expectRevert("Level doesn't exist");
        stats.createNewInstance(level_instance_1, level_factory_2, user);

        // should submit success for a level instance
        stats.submitSuccess(level_instance_1, level_factory_1, user);
        assertTrue(stats.isLevelCompleted(user, level_factory_1));

        // uint256 timeElapsed = stats.getTimeElapsedForCompletionOfLevel(
        //     user,
        //     level_factory_1
        // );
        // assertEq(timeElapsed, 0);

        // should throw error if invalid player address provided during level submission
        vm.expectRevert("Player doesn't exist");
        stats.submitSuccess(level_instance_1, level_factory_1, user2);

        // should throw error if player has not created a level instance yet and tries to submit
        stats.saveNewLevel(level_factory_2);
        stats.createNewInstance(level_instance_2, level_factory_2, user2);
        vm.expectRevert("Instance for the level is not created");
        stats.submitSuccess(level_instance_1, level_factory_1, user2);

        // should not allow submission of a level that is completed
        vm.expectRevert("Level already completed");
        stats.submitSuccess(level_instance_1, level_factory_1, user);

        // should submit failure for a level instance.
        stats.createNewInstance(level_instance_2, level_factory_2, user);

        // Submitting 2 failures for the same level instance
        stats.submitFailure(level_instance_2, level_factory_2, user);
        stats.submitFailure(level_instance_2, level_factory_2, user);
        assertFalse(stats.isLevelCompleted(user2, level_factory_2));

        // should return total number of levels created
        uint256 totalLevels = stats.getTotalNoOfLevelInstancesCreatedByPlayer(user);
        assertEq(totalLevels, 2);

        // should return total number of levels completed
        uint256 totalLevelsCompleted = stats.getTotalNoOfLevelInstancesCompletedByPlayer(user);
        assertEq(totalLevelsCompleted, 1);

        // should return total number of levels failed
        uint256 totalLevelsFailed = stats.getTotalNoOfFailedSubmissionsByPlayer(user);
        assertEq(totalLevelsFailed, 2);

        // should return percentange of levels completed
        uint256 percentage = stats.getPercentageOfLevelsCompleted(user);
        assertEq(percentage, 0.5 ether);

        // should calculate time taken for completion of a level
        stats.createNewInstance(level_instance_1, level_factory_1, user3);
        stats.createNewInstance(level_instance_2, level_factory_1, user3);
        stats.createNewInstance(level_instance_3, level_factory_1, user3);
        stats.submitSuccess(level_instance_3, level_factory_1, user3);
        assertEq(stats.getTimeElapsedForCompletionOfLevel(user3, level_factory_1), 3);
    }
}
