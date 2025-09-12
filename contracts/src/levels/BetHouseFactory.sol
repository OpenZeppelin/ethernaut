// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./BetHouse.sol";

contract BetHouseFactory is Level {
    function createInstance(address _player) public payable override returns (address) {
        
        PoolToken _wrappedToken = new PoolToken("PoolWrappedToken", "PWT");
        PoolToken _depositToken = new PoolToken("PoolDepositToken", "PDT");

        Pool pool = new Pool(address(_wrappedToken), address(_depositToken));
        BetHouse instance = new BetHouse(address(pool));
        _depositToken.mint(_player, 5);

        // set pool as tokens owners
        _wrappedToken.transferOwnership(address(pool));
        _depositToken.transferOwnership(address(pool));

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player) public view override returns (bool) {
        BetHouse instance = BetHouse(_instance);
        return instance.isBettor(_player);
    }

    receive() external payable {}
}
