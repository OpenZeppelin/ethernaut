// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {GoodSamaritan} from "src/levels/GoodSamaritan.sol";
import {GoodSamaritanFactory} from "src/levels/GoodSamaritanFactory.sol";
import {GoodSamaritanAttack} from "src/attacks/GoodSamaritanAttack.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestGoodSamaritan is Test, Utils {
    Ethernaut ethernaut;
    GoodSamaritan instance;

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
        GoodSamaritanFactory factory = new GoodSamaritanFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = GoodSamaritan(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
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

        instance.requestDonation();

        GoodSamaritanAttack attacker = new GoodSamaritanAttack(address(instance));
        attacker.attack();

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
