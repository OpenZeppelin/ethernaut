// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./ReentranceHouse.sol";

contract ReentranceHouseFactory is Level {
    function createInstance(
        address _player
    ) public payable override returns (address) {
        _player;

        PoolToken wrappedToken = new PoolToken("PoolWrappedToken", "PWT");
        PoolToken depositToken = new PoolToken("PoolDepositToken", "PDT");

        Pool pool = new Pool(address(wrappedToken), address(depositToken));
        ReentranceHouse instance = new ReentranceHouse(address(pool));
        depositToken.mint(_player, 5);

        // set pool as tokens owners
        wrappedToken.transferOwnership(address(pool));
        depositToken.transferOwnership(address(pool));

        return address(instance);
    }

    function validateInstance(
        address payable _instance,
        address _player
    ) public view override returns (bool) {
        _player;
        ReentranceHouse instance = ReentranceHouse(_instance);
        return instance.isBettor(_player);
    }

    receive() external payable {}
}
