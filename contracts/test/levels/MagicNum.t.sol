// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {MagicNum} from "src/levels/MagicNum.sol";
import {MagicNumFactory} from "src/levels/MagicNumFactory.sol";
import {MagicNumBadSolver} from "src/attacks/MagicNumBadSolver.sol";
import {MagicNumSolver} from "src/attacks/MagicNumSolver.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestMagicNum is Test, Utils {
    Ethernaut ethernaut;
    MagicNum instance;

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
        MagicNumFactory factory = new MagicNumFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = MagicNum(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        vm.startPrank(player);
        MagicNumBadSolver badSolver = new MagicNumBadSolver();
        instance.setSolver(address(badSolver));
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player);

        MagicNumSolver solver = new MagicNumSolver();
        instance.setSolver(address(solver));
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
