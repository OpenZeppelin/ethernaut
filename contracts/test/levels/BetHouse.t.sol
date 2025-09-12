// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {BetHouse, Pool, PoolToken} from "src/levels/BetHouse.sol";
import {BetHouseFactory} from "src/levels/BetHouseFactory.sol";
import {BetHouseAttack} from "src/attacks/BetHouseAttack.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestBetHouse is Test, Utils {
    Ethernaut ethernaut;
    BetHouse instance;

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
        BetHouseFactory factory = new BetHouseFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = BetHouse(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        vm.startPrank(player);
        submitLevelInstance(ethernaut, address(instance));
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player, player);
        BetHouseAttack attackContract =
            new BetHouseAttack(address(instance), payable(instance.pool()), Pool(instance.pool()).depositToken());
        PoolToken(Pool(instance.pool()).depositToken()).transfer(address(attackContract), 5);
        attackContract.attack{value: 0.001 ether}();
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
