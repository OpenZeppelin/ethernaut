// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Switch2 {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Changes the ownership of the contract. Can only be called by the owner.
    function changeOwnership(address _owner) public onlyOwner {
        owner = _owner;
    }

    // Changes the ownership of the contract to the sender provided the signature is created by the owner
    function changeOwnership(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(
            ecrecover(generateHash(owner), v, r, s) != address(0),
            "signer is not the owner"
        );
        owner = msg.sender;
    }

    // Generates a hash compatible with EIP-191 signatures
    function generateHash(address _addr) private pure returns (bytes32) {
        bytes32 addressHash = keccak256(abi.encodePacked(_addr));
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    addressHash
                )
            );
    }
}
