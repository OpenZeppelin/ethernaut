// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts-08/access/Ownable.sol";
import "openzeppelin-contracts-08/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts-08/utils/Strings.sol";

using Strings for uint256;

contract ImpersonatorTwo is Ownable {
    address public admin;
    uint256 public nonce;
    bool locked;

    constructor() payable {}

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function setAdmin(bytes memory signature, address newAdmin) public {
        string memory message = string(
            abi.encodePacked("admin", nonce.toString())
        );
        require(_verify(hash_message(message), signature), "Invalid signature");
        nonce++;
        admin = newAdmin;
    }

    function switchLock(bytes memory signature) public {
        string memory message = string(
            abi.encodePacked("lock", nonce.toString())
        );
        require(_verify(hash_message(message), signature), "Invalid signature");
        nonce++;
        locked = !locked;
    }

    function withdraw() public onlyAdmin {
        require(!locked, "Funds are locked");
        payable(admin).transfer(address(this).balance);
    }

    function hash_message(string memory message) public pure returns (bytes32) {
        return ECDSA.toEthSignedMessageHash(abi.encodePacked(message));
    }

    function _verify(
        bytes32 hash,
        bytes memory signature
    ) internal view returns (bool) {
        return ECDSA.recover(hash, signature) == owner();
    }
}
