// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./MagicAnimalCarousel.sol";

contract MagicAnimalCarouselFactory is Level {
    function createInstance(address _player) public payable override returns (address) {
        _player;
        MagicAnimalCarousel magicAnimalCarousel = new MagicAnimalCarousel();
        return address(magicAnimalCarousel);
    }

    function validateInstance(address payable _instance, address _player) public override returns (bool) {
        _player;
        MagicAnimalCarousel instance = MagicAnimalCarousel(_instance);
        // Store a goat in the box
        string memory goat = "Goat";
        instance.setAnimalAndSpin(goat);
        
        // Goat should be mutated
        uint256 currentCrateId = instance.currentCrateId();
        uint256 animalInBox = instance.carousel(currentCrateId) >> 176;
        uint256 goatEnc = uint256(bytes32(abi.encodePacked(goat))) >> 176;
        return animalInBox != goatEnc;
    }
}