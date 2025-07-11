// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts-08/access/Ownable.sol";
import "openzeppelin-contracts-08/utils/cryptography/ECDSA.sol";

contract ImpersonatorThree is Ownable {
    constructor() payable {}

    function withdraw(bytes32 message, bytes memory signature) public {
        require(_verify(message, signature), "Invalid signature");
        payable(msg.sender).transfer(address(this).balance);
    }

    function _verify(
        bytes32 message,
        bytes memory signature
    ) internal returns (bool) {
        return ECDSA.recover(message, signature) == owner();
    }
}
