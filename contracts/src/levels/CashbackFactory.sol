// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

import {Level} from "./base/Level.sol";
import {Cashback, Currency} from "./Cashback.sol";

import {ERC721} from "openzeppelin-contracts-v5.4.0/token/ERC721/ERC721.sol";
import {ERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts-v5.4.0/access/Ownable.sol";

contract SuperCashbackNFT is ERC721, Ownable {
    constructor() ERC721("Super Cashback", "SCB") Ownable(msg.sender) {}

    function mint(address receiver) public onlyOwner {
        _mint(receiver, uint256(uint160(receiver)));
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
    uint256 constant NATIVE_CASHBACK_RATE = 50; // 0.5%
    uint256 constant FREE_CASHBACK_RATE = 200; // 2%
    uint256 constant NATIVE_MAX_CASHBACK = 1 ether;
    uint256 constant FREE_MAX_CASHBACK = 500 ether;

    constructor() {
        FREE = new FreedomCoin();
        FREE.mint(BOB, 100 ether);
    }

    function createInstance(address _player) public payable override returns (address) {
        _player;

        // Deploy Super Cashback NFT
        SuperCashbackNFT superCashbackNFT = new SuperCashbackNFT();

        // Deploy Cashback
        address[] memory cashbackCurrencies = new address[](2);
        cashbackCurrencies[0] = NATIVE_CURRENCY;
        cashbackCurrencies[1] = address(FREE);

        uint256[] memory cashbackRates = new uint256[](2);
        cashbackRates[0] = NATIVE_CASHBACK_RATE;
        cashbackRates[1] = FREE_CASHBACK_RATE;

        uint256[] memory maxCashback = new uint256[](2);
        maxCashback[0] = NATIVE_MAX_CASHBACK;
        maxCashback[1] = FREE_MAX_CASHBACK;

        Cashback instance = new Cashback(cashbackCurrencies, cashbackRates, maxCashback, address(superCashbackNFT));

        // Transfer Super Cashback NFT ownership to Cashback
        superCashbackNFT.transferOwnership(address(instance));

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        bytes23 expectedCode = bytes23(bytes.concat(hex"ef0100", abi.encodePacked(_instance)));

        return Cashback(_instance).balanceOf(_player, Currency.wrap(NATIVE_CURRENCY).toId()) == NATIVE_MAX_CASHBACK
            && Cashback(_instance).balanceOf(_player, Currency.wrap(address(FREE)).toId()) == FREE_MAX_CASHBACK
            && ERC721(Cashback(_instance).superCashbackNFT()).ownerOf(uint256(uint160(_player))) == _player
            && ERC721(Cashback(_instance).superCashbackNFT()).balanceOf(_player) >= 2 && _player.code.length == 23
            && bytes23(_player.code) == expectedCode;
    }
}
