// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {EllipticToken} from "src/levels/EllipticToken.sol";
import {EllipticTokenFactory} from "src/levels/EllipticTokenFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestEllipticToken is Test, Utils {
    Ethernaut ethernaut;
    EllipticToken instance;

    address payable initializer;
    address player;
    uint256 playerKey;

    uint256 INITIAL_AMOUNT = 10 ether;
    address ALICE = 0xA11CE84AcB91Ac59B0A4E2945C9157eF3Ab17D4e;
    address BOB = 0xB0B14927389CB009E0aabedC271AC29320156Eb8;

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        address payable[] memory users = createUsers(2);

        initializer = users[0];
        vm.label(initializer, "Initializer");

        (player, playerKey) = makeAddrAndKey("Player");

        vm.startPrank(initializer);
        ethernaut = getEthernautWithStatsProxy(initializer);
        EllipticTokenFactory factory = new EllipticTokenFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = EllipticToken(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        vm.startPrank(player);
        assertEq(instance.balanceOf(ALICE), 10 ether);
        assertEq(instance.owner(), BOB);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player, player);

        // Spoofed signature generated with EllipticToken.py script
        bytes32 r = 0xd3433fe216c991674d4c7e2186460a412b91c976c44569433a0985dffc099b02;
        bytes32 s = 0x16417451991575e0cdfc4aaff865deb0843abf95f606aed775fda4e40e047e14;
        uint8 v = 27;
        uint256 amount = uint256(0x59e540931475e32e9ace9d434a5667767f569cd3c8316ea28398398bac06df55);
        bytes memory aliceSpoofedSignature = abi.encodePacked(r, s, v);

        // Permit acceptance signature
        bytes32 permitAcceptHash = keccak256(abi.encodePacked(ALICE, player, amount));
        (v, r, s) = vm.sign(playerKey, permitAcceptHash);
        bytes memory playerPermitAcceptanceSignature = abi.encodePacked(r, s, v);

        // Call permit to approve the transfer
        instance.permit(amount, player, aliceSpoofedSignature, playerPermitAcceptanceSignature);

        // Drain the funds
        instance.transferFrom(ALICE, player, INITIAL_AMOUNT);

        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
