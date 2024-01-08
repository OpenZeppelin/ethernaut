// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "openzeppelin-contracts-08/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts-08/access/Ownable.sol";
import {ReentrancyGuard} from "openzeppelin-contracts-08/security/ReentrancyGuard.sol";

contract ReentranceHouse {
    address private s_pool;
    uint256 private constant BET_PRICE = 20;
    mapping(address => bool) private s_bettors;

    error InsufficientFunds();
    error FundsNotLocked();

    constructor(address pool_) {
        s_pool = pool_;
    }

    function makeBet(address bettor_) external {
        if (Pool(s_pool).balanceOf(msg.sender) < BET_PRICE)
            revert InsufficientFunds();
        if (!Pool(s_pool).depositsLocked(msg.sender)) revert FundsNotLocked();
        s_bettors[bettor_] = true;
    }

    function isBettor(address bettor_) external view returns (bool) {
        return s_bettors[bettor_];
    }
}

contract Pool is ReentrancyGuard {
    address private s_wrappedToken;
    address private s_depositToken;

    mapping(address => uint256) private s_depositedEther;
    mapping(address => uint256) private s_depositedPDT;
    mapping(address => bool) private s_lockedDeposits;

    error InvalidDeposit();
    error AlreadyDeposited();
    error InsufficientAllowance();

    constructor(address wrappedToken_, address depositToken_) {
        s_wrappedToken = wrappedToken_;
        s_depositToken = depositToken_;
    }

    function deposit(uint256 value) external payable {
        uint256 _valueToMint;
        // check to deposit ether
        if (msg.value == 0.001 ether) {
            if (s_depositedEther[msg.sender] != 0) revert AlreadyDeposited();
            s_depositedEther[msg.sender] += msg.value;
            _valueToMint += 10;
        }
        // check to deposit PDT
        if (value > 0) {
            if (
                PoolToken(s_depositToken).allowance(msg.sender, address(this)) <
                value
            ) revert InsufficientAllowance();
            s_depositedPDT[msg.sender] += value;
            PoolToken(s_depositToken).transferFrom(
                msg.sender,
                address(this),
                value
            );
            _valueToMint += value;
        }
        if (_valueToMint == 0) revert InvalidDeposit();
        PoolToken(s_wrappedToken).mint(msg.sender, _valueToMint);
    }

    function withdrawAll() external nonReentrant {
        // send the DT to the user
        uint256 _depositedValue = s_depositedPDT[msg.sender];

        s_depositedPDT[msg.sender] = 0;
        PoolToken(s_depositToken).transfer(msg.sender, _depositedValue);

        // send the ether to the user
        _depositedValue = s_depositedEther[msg.sender];

        s_depositedEther[msg.sender] = 0;
        payable(msg.sender).call{value: _depositedValue}("");

        uint256 _pwtBalance = PoolToken(s_wrappedToken).balanceOf(msg.sender);
        PoolToken(s_wrappedToken).burn(msg.sender, _pwtBalance);
    }

    function lockDeposits() external {
        s_lockedDeposits[msg.sender] = true;
    }

    function depositsLocked(address account_) external view returns (bool) {
        return s_lockedDeposits[account_];
    }

    function balanceOf(address account_) external view returns (uint256) {
        return PoolToken(s_wrappedToken).balanceOf(account_);
    }
}

contract PoolToken is ERC20, Ownable {
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable() {}

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
