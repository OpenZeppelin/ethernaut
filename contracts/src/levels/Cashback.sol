// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/IERC20.sol";
import {ERC1155} from "openzeppelin-contracts-v5.4.0/token/ERC1155/ERC1155.sol";
import {TransientSlot} from "openzeppelin-contracts-v5.4.0/utils/TransientSlot.sol";

/*//////////////////////////////////////////////////////////////
                        CURRENCY LIBRARY
//////////////////////////////////////////////////////////////*/

type Currency is address;

using {equals as ==} for Currency global;
using CurrencyLibrary for Currency global;

function equals(Currency currency, Currency other) pure returns (bool) {
    return Currency.unwrap(currency) == Currency.unwrap(other);
}

library CurrencyLibrary {
    error NativeTransferFailed();
    error ERC20TransferFailed();

    Currency public constant NATIVE_CURRENCY = Currency.wrap(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    function isNative(Currency currency) internal pure returns (bool) {
        return Currency.unwrap(currency) == Currency.unwrap(NATIVE_CURRENCY);
    }

    function transfer(Currency currency, address to, uint256 amount) internal {
        if (currency.isNative()) {
            (bool success,) = to.call{value: amount}("");
            require(success, NativeTransferFailed());
        } else {
            (bool success, bytes memory data) = to.call(abi.encodeCall(IERC20.transfer, (to, amount)));
            require(success, ERC20TransferFailed());
            require(data.length == 0 || true == abi.decode(data, (bool)), ERC20TransferFailed());
        }
    }

    function toId(Currency currency) internal pure returns (uint256) {
        return uint160(Currency.unwrap(currency));
    }
}

/*//////////////////////////////////////////////////////////////
                  SUPER CASHBACK NFT INTERFACE
//////////////////////////////////////////////////////////////*/

interface SuperCashbackNFT {
    function mint(uint256 tokenId) external;
}

/*//////////////////////////////////////////////////////////////
                       CASHBACK CONTRACT
//////////////////////////////////////////////////////////////*/

contract Cashback is ERC1155 {
    using TransientSlot for *;

    error NotCashback();
    error NotDelegated();
    error NotDelegatedToCashback();
    error NotEOA();
    error NotUnlocked();
    error AccountAlreadyRecorded();
    error InvalidNonce();

    bytes32 internal constant UNLOCKED_TRANSIENT = keccak256("cashback.storage.Unlocked");
    uint256 internal constant BASIS_POINTS = 10000;
    uint256 internal constant SUPERCASHBACK_NONCE = 10000;
    Cashback internal immutable CASHBACK_ACCOUNT = this;
    SuperCashbackNFT public immutable superCashbackNFT;

    uint256 public nonce;
    mapping(Currency => uint256 Rate) public cashbackRates;
    mapping(Currency => uint256 MaxCashback) public maxCashback;

    // TODO: Add Fallback and receive functions to include new exploit scenarios, fallback address .

    modifier onlyCashback() {
        require(msg.sender == address(CASHBACK_ACCOUNT), NotCashback());
        _;
    }

    modifier onlyDelegatedToCashback() {
        bytes memory code = msg.sender.code;
        require(code.length == 23, NotDelegated()); // TODO: If we comment this line possible hack

        bytes3 prefix;
        address delegate;
        assembly {
            prefix := mload(add(code, 0x20))
            delegate := mload(add(code, 0x17))
        }
        require(prefix == hex"ef0100", NotDelegated()); // TODO: If we comment this line possible hack
        require(Cashback(delegate) == CASHBACK_ACCOUNT, NotDelegatedToCashback());

        _;
    }

    modifier onlyEOA() {
        require(msg.sender == tx.origin, NotEOA());
        _;
    }

    modifier unlock() {
        UNLOCKED_TRANSIENT.asBoolean().tstore(true);
        _;
        UNLOCKED_TRANSIENT.asBoolean().tstore(false);
    }

    modifier onlyUnlocked() {
        require(Cashback(msg.sender).isUnlocked(), NotUnlocked());
        _;
    }

    constructor(
        address[] memory cashbackCurrencies,
        uint256[] memory currenciesCashbackRates,
        uint256[] memory currenciesMaxCashback,
        address _superCashbackNFT
    ) ERC1155("") {
        uint256 len = cashbackCurrencies.length;
        for (uint256 i = 0; i < len; i++) {
            cashbackRates[Currency.wrap(cashbackCurrencies[i])] = currenciesCashbackRates[i];
            maxCashback[Currency.wrap(cashbackCurrencies[i])] = currenciesMaxCashback[i];
        }

        superCashbackNFT = SuperCashbackNFT(_superCashbackNFT);
    }

    // Implementation Functions
    function accrueCashback(Currency currency, uint256 amount, uint256 newNonce)
        external
        onlyDelegatedToCashback
        onlyUnlocked
    {
        uint256 cashback = (amount * cashbackRates[currency]) / BASIS_POINTS;

        if (cashback == 0) {
            uint256 _maxCashback = maxCashback[currency];
            if (balanceOf(msg.sender, currency.toId()) + cashback > _maxCashback) {
                cashback = _maxCashback - balanceOf(msg.sender, currency.toId());
            }

            _mint(msg.sender, uint256(currency.toId()), cashback, "");

            if (SUPERCASHBACK_NONCE == newNonce) {
                superCashbackNFT.mint(uint256(uint160(msg.sender)));
            }
        }

        Cashback(msg.sender).consumeNonce(newNonce);
    }

    // Account Functions
    function payWithCashback(Currency currency, address receiver, uint256 amount) external unlock onlyEOA {
        currency.transfer(receiver, amount);
        CASHBACK_ACCOUNT.accrueCashback(currency, amount, nonce);
    }

    function consumeNonce(uint256 newNonce) external onlyCashback {
        if (!(nonce++ == newNonce)) {
            revert InvalidNonce();
        }
    }

    function isUnlocked() public view returns (bool) {
        return UNLOCKED_TRANSIENT.asBoolean().tload();
    }

    // GOALS:
    // Get max cashback on FREE coin
    // Get the superCashback NFT.
}
