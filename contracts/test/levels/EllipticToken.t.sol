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
    address ALICE = 0xA1CE90808eb98D3e2df25813f04EdCF073816dE6;
    address BOB = 0xB0BD214A47c91869AcdaF3BA2dC502C92FF4808c;

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
        assertEq(instance.balanceOf(0xA1CE90808eb98D3e2df25813f04EdCF073816dE6), 10 ether);
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player, player);

        // Spoofed signature generated with EllipticToken.py script
        bytes32 r = 0xfdc36d21677e3e195676ed6b63bdefa5faf21d9416eacf576330b6c770c3b70e;
        bytes32 s = 0x50ed65b7216c4c6992c3918da6ef9fdf262791f631f8008e2a024c9db22e5ae7;
        uint8 v = 27;
        uint256 amount = uint256(0xb514af48119b2aaaa2e16b6ba321a45e27eae039b58e985c4bc36455478ddf94);
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
