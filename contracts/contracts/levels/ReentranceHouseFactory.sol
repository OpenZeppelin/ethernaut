// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./ReentranceHouse.sol";

contract ReentranceHouseFactory is Level {
    function createInstance(
        address _player
    ) public payable override returns (address) {
        _player;

        PoolToken _wrappedToken = new PoolToken("PoolWrappedToken", "PWT");
        PoolToken _depositToken = new PoolToken("PoolDepositToken", "PDT");

        Pool pool = new Pool(address(_wrappedToken), address(_depositToken));
        ReentranceHouse instance = new ReentranceHouse(address(pool));
        _depositToken.mint(_player, 5);

        // set pool as tokens owners
        _wrappedToken.transferOwnership(address(pool));
        _depositToken.transferOwnership(address(pool));

        return address(instance);
    }

    function validateInstance(
        address payable _instance,
        address _player
    ) public view override returns (bool) {
        ReentranceHouse instance = ReentranceHouse(_instance);
        return instance.isBettor(_player);
    }

    receive() external payable {}
}
