pragma solidity ^0.6.0;

import "./base/Level.sol";
import "./Funding.sol";

contract FundingFactory is Level {
    uint256 public initialDeposit = 1 ether;

    function createInstance(address _player)
        public
        payable
        override
        returns (address)
    {
        _player;
        require(msg.value >= initialDeposit);

        Funding instance = new Funding();

        (bool result, ) = address(instance).call.value(
            msg.value
        )("");
        require(result);

        return address(instance);
    }

    function validateInstance(address payable _instance, address)
        public
        override
        returns (bool)
    {
        Funding instance = Funding(_instance);
        return address(instance).balance == 0;
    }
}
