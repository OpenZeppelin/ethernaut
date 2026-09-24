// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/ERC20.sol";

interface IFlashLoanReceiver {
    function onFlashLoan(uint256 amount) external;
}

/// @notice A governance token with a flash mint, charging the same 0.3% fee
/// Uniswap V2 charges on a flash swap. There's no cooldown and no
/// restriction on who can call it: any contract can hold `amount` tokens for
/// exactly as long as this call is on the stack, then has to give them back
/// plus the fee. The principal is minted and burned from nothing, but the
/// fee has to come from the caller's own pre-existing balance: the loan
/// itself is free of collateral, the fee is not.
contract FlashQuorumToken is ERC20 {
    address public immutable dao;
    uint256 public constant FLASH_FEE_BPS = 30; // 0.3%, same as Uniswap V2

    constructor(uint256 initialSupply, address _dao, address player, uint256 playerFeeReserve)
        ERC20("Governance Token", "GOV")
    {
        dao = _dao;
        _mint(dao, initialSupply);
        _mint(player, playerFeeReserve);
    }

    function flashFee(uint256 amount) public pure returns (uint256) {
        return (amount * FLASH_FEE_BPS) / 10_000;
    }

    function flashLoan(uint256 amount) external {
        uint256 fee = flashFee(amount);
        _mint(msg.sender, amount);
        IFlashLoanReceiver(msg.sender).onFlashLoan(amount);
        _burn(msg.sender, amount);
        _transfer(msg.sender, dao, fee);
    }
}
