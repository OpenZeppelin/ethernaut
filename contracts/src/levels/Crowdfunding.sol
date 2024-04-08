// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Crowdfunding {
    address public owner;
    address public artist;
    string public projectName;
    bytes public lastSignature;

    receive() external payable {}

    constructor(address owner_, string memory newProjectName) {
        owner = owner_;
        projectName = newProjectName;
    }

    function withdraw() external {
        require(msg.sender == artist, "Not artist");

        (bool success, ) = artist.call{value: address(this).balance}("");

        require(success, "Withdraw failed");
    }

    function setArtist(address newArtist, bytes calldata signature) external {
        require(
            keccak256(signature) != keccak256(lastSignature),
            "already used signature"
        );
        bytes32 nameHash = keccak256(abi.encodePacked(projectName));
        bytes32 messageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", nameHash)
        );
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        require(owner == ecrecover(messageHash, v, r, s));

        artist = newArtist;
        lastSignature = signature;
    }

    function splitSignature(
        bytes memory signature
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        if (signature.length == 65) {
            assembly {
                r := mload(add(signature, 0x20))
                s := mload(add(signature, 0x40))
                v := byte(0, mload(add(signature, 0x60)))
            }
        }
    }
}
