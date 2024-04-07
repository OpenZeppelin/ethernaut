// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Level} from "./base/Level.sol";
import {Crowdfunding} from "./Crowdfunding.sol";

contract CrowdfundingFactory is Level {
    bytes public signature;
    address public signer;
    address public artist;

    constructor(bytes memory signature_, address signer_, address artist_) {
        signature = signature_;
        signer = signer_;
        artist = artist_;
    }

    function createInstance(
        address _player
    ) public payable override returns (address) {
        _player;

        string memory projectName = "amazing crowdfunding";
        Crowdfunding crowdfunding = new Crowdfunding(signer, projectName);

        (bool success, ) = address(crowdfunding).call{value: 1 ether}("");
        require(success, "Failed to transfer funds");
        crowdfunding.setArtist(artist, signature);

        return address(crowdfunding);
    }

    function validateInstance(
        address payable _instance,
        address _player
    ) public view override returns (bool) {
        Crowdfunding crowdfunding = Crowdfunding(_instance);

        return crowdfunding.artist() == _player && _instance.balance == 0;
    }
}
