// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts-08/token/ERC20/ERC20.sol";

contract SignatureCoin is ERC20 {
    mapping(bytes32 => bool) public usedSignatures;

    constructor(address source) ERC20("SignatureCoin", "SGC") {
        _mint(source, 100 * uint256(10)**decimals());
    }

    function transferWithSignature(
        address recipient,
        uint256 amount,
        uint256 nonce,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public {
        bytes32 message = keccak256(abi.encode(recipient, amount, nonce));
        bytes32 msgHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", message)
        );
        bytes32 sigHash = keccak256(abi.encodePacked(r, s, v));

        require(
            usedSignatures[sigHash] == false,
            "SignatureCoin: transfer already executed"
        );
        usedSignatures[sigHash] = true;

        address signer = ecrecover(msgHash, v, r, s);
        require(signer != address(0), "SignatureCoin: invalid signature");

        _transfer(signer, recipient, amount);
    }
}
