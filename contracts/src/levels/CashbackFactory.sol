// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Level} from "./base/Level.sol";
import {Cashback} from "./Cashback.sol";

import {ERC721} from "openzeppelin-contracts-v5.4.0/token/ERC721/ERC721.sol";
import {ERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts-v5.4.0/access/Ownable.sol";

contract SuperCashbackNFT is ERC721, Ownable {
    constructor(address initialOwner) ERC721("Super Cashback", "SCB") Ownable(initialOwner) {}

    function mint(uint256 tokenId) public onlyOwner {
        _mint(msg.sender, tokenId);
    }
}

contract FreedomCoin is ERC20, Ownable {
    constructor() ERC20("Freedom Coin", "FREE") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract CashbackFactory is Level {
    FreedomCoin public immutable FREE;
    address constant NATIVE_CURRENCY = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address constant BOB = address(0xB0B);
    uint256 constant NATIVE_MAX_CASHBACK = 1 ether;
    uint256 constant FREE_MAX_CASHBACK = 500 ether;

    constructor() {
        FREE = new FreedomCoin();
        FREE.mint(BOB, 100 ether);
    }

    function createInstance(address _player) public payable override returns (address) {
        _player;

        // Deploy Super Cashback NFT
        SuperCashbackNFT superCashbackNFT = new SuperCashbackNFT(address(this));

        // Deploy Cashback
        address[] memory cashbackCurrencies = new address[](2);
        cashbackCurrencies[0] = NATIVE_CURRENCY;
        cashbackCurrencies[1] = address(FREE);

        uint256[] memory cashbackRates = new uint256[](2);
        cashbackRates[0] = 50; // 0.5%
        cashbackRates[1] = 200; // 2%

        uint256[] memory maxCashback = new uint256[](2);
        maxCashback[0] = NATIVE_MAX_CASHBACK;
        maxCashback[1] = FREE_MAX_CASHBACK;

        Cashback cashback = new Cashback(cashbackCurrencies, cashbackRates, maxCashback, address(superCashbackNFT));

        return address(cashback);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        _player;
        // Verify instance
        return false;
    }
}
