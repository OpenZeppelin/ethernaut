// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {CoinFlip} from "src/levels/CoinFlip.sol";
import {CoinFlipFactory} from "src/levels/CoinFlipFactory.sol";
import {CoinFlipAttack} from "src/attacks/CoinFlipAttack.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestCoinflip is Test, Utils {
    Ethernaut ethernaut;
    CoinFlip instance;

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
        CoinFlipFactory factory = new CoinFlipFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = CoinFlip(createLevelInstance(ethernaut, Level(address(factory))));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        vm.prank(player);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player);
        CoinFlipAttack attacker = new CoinFlipAttack();

        // To weaponize this attack you'd need to pole for a new block to be mined, as the contract only allows one flip per block.
        for (uint256 i = 0; i < 10; i++) {
            vm.roll(block.number + 1);
            attacker.attack(address(instance));
            console.log(i);
        }

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
