// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/ERC20.sol";

interface IFlashLoanReceiver {
    function onFlashLoan(uint256 amount) external;
}

/// @notice A governance token with a flash mint.
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
