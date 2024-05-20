// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Level} from "./base/Level.sol";
import {Crowdfunding} from "./Crowdfunding.sol";

contract CrowdfundingFactory is Level {
    bytes public signature =
        hex"7986fd095b20021de58a0c43a03a9f18204bc4f0e05d2624cb539174e73e0a4c048155b5a878c337217db7244af6b3930a6ee90ffba2d488f3bce6f7258ca2251c";
    address public signer = 0x7c8999dC9a822c1f0Df42023113EDB4FDd543266;
    address public artist = 0x9aF2E2B7e57c1CD7C68C5C3796d8ea67e0018dB7;

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
