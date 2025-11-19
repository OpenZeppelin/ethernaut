// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import { ERC20 } from "openzeppelin-contracts-v4.6.0/token/ERC20/ERC20.sol";
import { ECDSA } from "openzeppelin-contracts-v4.6.0/utils/cryptography/ECDSA.sol";

contract Forger is ERC20 {

    error SignatureExpired();
    error SignatureUsed();
    error InvalidSigner(address wrongSigner);
    error OnlyOwner();

    address public owner = 0xC9CAF9e17BBb4e4D27810d97d2C2a467A701e0D5;
    mapping(bytes32 signatureHash => bool used) public signatureUsed;

    constructor() ERC20("Forger Token", "FT") {}

    // It seems like the owner has already signed a mint of tokens for someone:
    // signature = f73465952465d0595f1042ccf549a9726db4479af99c27fcf826cd59c3ea7809402f4f4be134566025f4db9d4889f73ecb535672730bb98833dafb48cc0825fb1c
    // amount = 100 ether
    // receiver = 0x1D96F2f6BeF1202E4Ce1Ff6Dad0c2CB002861d3e
    // salt = 0x044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d
    // deadline = 115792089237316195423570985008687907853269984665640564039457584007913129639935
    function createNewTokensFromOwnerSignature(
        bytes calldata signature,
        address receiver,
        uint256 amount,
        bytes32 salt,           
        uint256 deadline      
    ) public {
        require(block.timestamp <= deadline, SignatureExpired());
        require(!signatureUsed[keccak256(signature)], SignatureUsed());

        bytes32 messageHash = keccak256(abi.encode(
            receiver,
            amount,
            salt,
            deadline
        ));

        address signer = ECDSA.recover(messageHash, signature);

        require(signer == owner, InvalidSigner(signer));

        signatureUsed[keccak256(signature)] = true;

        _mint(receiver, amount);
    }

    function invalidateSignature(bytes calldata signature) external {
        require(msg.sender == owner, OnlyOwner());
        signatureUsed[keccak256(signature)] = true;
    }
}
