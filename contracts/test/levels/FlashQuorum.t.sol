// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {FlashQuorum} from "src/levels/FlashQuorum.sol";
import {FlashQuorumFactory} from "src/levels/FlashQuorumFactory.sol";
import {FlashQuorumAttack} from "src/attacks/FlashQuorumAttack.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestFlashQuorum is Test, Utils {
    Ethernaut ethernaut;
    FlashQuorum instance;
    FlashQuorumFactory factory;

    address payable owner;
    address payable player;

    uint256 constant QUORUM = 500 ether;

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
        factory = new FlashQuorumFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = FlashQuorum(payable(createLevelInstance(ethernaut, Level(address(factory)), 0.001 ether)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the initial state of the level and environment.
    function testInit() public {
        vm.startPrank(player);
        assertEq(address(instance).balance, 0.001 ether);
        assertEq(instance.govToken().balanceOf(player), 2 ether);
        assertFalse(instance.drained());
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
        vm.stopPrank();
    }

    /// @notice Test the solution for the level. A flash-minted balance is
    /// enough to clear quorum for the single call it's held in, since the
    /// treasury reads live balanceOf() with no snapshot. The 0.3% flash fee
    /// (mirroring Uniswap V2) has to come out of the player's own starting
    /// balance, not the flash-minted principal.
    function testSolve() public {
        vm.startPrank(player);

        FlashQuorumAttack attacker = new FlashQuorumAttack(address(instance.govToken()), address(instance));
        uint256 fee = instance.govToken().flashFee(QUORUM);
        instance.govToken().approve(address(attacker), fee);
        attacker.attack(QUORUM);

        assertEq(instance.govToken().balanceOf(instance.govToken().dao()), 1_000 ether + fee);
        assertTrue(instance.drained());
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
        vm.stopPrank();
    }
}
