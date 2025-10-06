// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import { ERC721 } from "openzeppelin-contracts-v5.4.0/token/ERC721/ERC721.sol";
import { ERC721Utils } from "openzeppelin-contracts-v5.4.0/token/ERC721/utils/ERC721Utils.sol";
import { ReentrancyGuard } from "openzeppelin-contracts-v5.4.0/utils/ReentrancyGuard.sol";

contract UniqueNFT is ERC721, ReentrancyGuard {

    uint256 public tokenId;

    constructor() ERC721("UniqueNFT", "UNFT") {}

    /// @notice Function to mint NFTs for smart contracts only
    /// @notice Smart contracts need to pay a fee to mint the NFT
    /// @dev Has reentrancy protection just in case the smart contract would try to do some bad stuff
    function mintNFTSmartContract() external payable nonReentrant returns(uint256 mintedNFT) {
        require(msg.value == 1 ether, "fee not sent");
        mintedNFT = _mintNFT();
    }

    /// @notice Function to mint NFTs for EOAs only
    /// @notice EOAs are exempt from minting the NFT
    function mintNFTEOA() external returns(uint256 mintedNFT) {
        require(tx.origin == msg.sender, "not an EOA");
        mintedNFT = _mintNFT();
    }

    function _mintNFT() private returns(uint256) {
        require(balanceOf(msg.sender) == 0, "only one unique NFT allowed");
        uint256 _tokenId = tokenId++;
        ERC721Utils.checkOnERC721Received(address(0), address(0), msg.sender, _tokenId, "");
        _mint(msg.sender, _tokenId);
        return _tokenId;
    }

    function _update(address to, uint256 _tokenId, address auth) internal override returns (address) {
        address from = super._update(to, _tokenId, auth);
        require(from == address(0), "transfers not allowed");
        return from;
    }
}
