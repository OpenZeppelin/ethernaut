// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {ImpersonatorThree} from "src/levels/ImpersonatorThree.sol";
import {ImpersonatorThreeFactory} from "src/levels/ImpersonatorThreeFactory.sol";
import {ImpersonatorThreeAttack} from "src/attacks/ImpersonatorThreeAttack.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestImpersonatorThree is Test, Utils {
    Ethernaut ethernaut;
    ImpersonatorThree instance;

    address payable initializer;
    address payable player;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        address payable[] memory users = createUsers(2);

        initializer = users[0];
        vm.label(initializer, "Initializer");

        player = users[1];
        vm.label(player, "Player");

        vm.startPrank(initializer);
        ethernaut = getEthernautWithStatsProxy(initializer);
        ImpersonatorThreeFactory factory = new ImpersonatorThreeFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = ImpersonatorThree(
            payable(
                createLevelInstance(
                    ethernaut,
                    Level(address(factory)),
                    0.001 ether
                )
            )
        );
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

    function testTryRandomSignature() public {
        vm.startPrank(player);
        ImpersonatorThree levelInstance = ImpersonatorThree(address(instance));
        bytes
            memory signature = hex"00899a178b233e1842e6b968d61c0b8455025fa57d39055c74b3e9b26e3bade177a51bb47d4a7e36c7b8234d1924ff9c7b964bcee47a5b0eb27a24e2ce770b08224e1fc375d0a976bb63b5a0bac856b7ebdf45580c1ce108695299daf5de421b";
        bytes32 data = hex"4f3392f7e8c93ad0eb4c81928dcb11badbc93c81cfed0adda0078c42c043e0bb";

        vm.expectRevert();
        levelInstance.withdraw(data, signature);
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player);

        ImpersonatorThreeAttack attacker = new ImpersonatorThreeAttack();
        attacker.attack(address(instance));

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
