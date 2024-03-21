// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
pragma experimental ABIEncoderV2;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

// import {Token} from "src/levels/Token.sol";
// import {TokenFactory} from "src/levels/TokenFactory.sol";
// import {Level} from "src/levels/base/Level-06.sol";
// import {Ethernaut} from "src/Ethernaut.sol";

contract TestToken is Test, Utils {
    // Ethernaut ethernaut;
    // Token instance;

    address payable owner;
    address payable player;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    // function setUp() public {
    //     address payable[] memory users = createUsers(2);

    //     owner = users[0];
    //     vm.label(owner, "Owner");

    //     player = users[1];
    //     vm.label(player, "Player");

    //     vm.startPrank(owner);
    //     ethernaut = getEthernautWithStatsProxy(owner);
    //     TokenFactory factory = new TokenFactory();
    //     ethernaut.registerLevel(Level(address(factory)));
    //     vm.stopPrank();

    //     vm.startPrank(player);
    //     instance = Token(payable(createLevelInstance(ethernaut, Level(address(factory)), 0.001 ether)));
    //     vm.stopPrank();
    // }

    // /*//////////////////////////////////////////////////////////////
    //                              TESTS
    // //////////////////////////////////////////////////////////////*/

    // /// @notice Check the intial state of the level and enviroment.
    // function testInit() public {
    //     vm.startPrank(player);
    //     assertFalse(submitLevelInstance(ethernaut, address(instance)));
    // }

    // /// @notice Test the solution for the level.
    // function testSolve() public {
    //     vm.startPrank(player);

    //     level.transfer(address(instance), 21);

    //     assertTrue(submitLevelInstance(ethernaut, address(instance)));
    // }
}
