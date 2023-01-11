// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./OrderBook.sol";
import "./OrderBookProxy.sol";

/// @title Factory contract for OrderBook
/// @author Andrew, Nikesh, Rick
/// @notice Besides deploying an OrderBook, this contract also deploys 3 dummy tokens and sets initial token balances for dummy users
/// @dev Initial setup value can be changed as needed
contract OrderBookFactory is Level {
    uint256 constant scalar = 1e18;

    address private _implementation;

    uint256[3] TOKEN_SUPPLIES = [1000, 1000, 1000];

    ///To hold deployed token addresses
    address[3] public tokenAdds = [address(0xA), address(0xB), address(0xC)];

    ///Dummy user addresses and their initial 3 token balances in 2 arrays. This also sets the initial balance for the player (msg.sender)
    address[6] USERS = [
        0xE3EeaDaD850BCf71390961945d3Bae854C41d276,
        0xf8f398e1b3Be169f4A1aEA3553ad8c3550B58a5d,
        0xF0902f8573acfD685978450Bc2485c002471D4B0,
        0xb9a9B73CE551c06EEA59143B9BEdaA8195F517FF,
        0x421244A7A8809c73a9D6806b91E322c85e9574df,
        msg.sender
    ];

    uint256[3][6] INITIAL_TOKEN_BALANCES = [
        [100, 75, 0],
        [50, 30, 50],
        [10, 80, 60],
        [200, 200, 180],
        [20, 40, 40],
        [0, 80, 0]
    ];

    ///This level will be successful if the challenger achieves this many TokenC tokens
    uint256 VERIFY_THRESHOLD_TOKEN_C = 100 * scalar;

    constructor(address implementation) {
        ///Setup checks
        require(
            USERS.length == INITIAL_TOKEN_BALANCES.length,
            "Incorrect USERS or INITIAL_TOKEN_BALANCES"
        );

        _implementation = implementation;
    }

    function createInstance(address) public payable override returns (address) {
        ///Deploy orderBook instance, which is really a proxy of a deployed OrderBook
        OrderBook orderBook_instance = OrderBook(
            address(new OrderBookProxy(_implementation))
        );

        // initialize that newly created proxy instance
        orderBook_instance.initialize();

        ///* Whitelist 3 tokens with OrderBook
        ///* Transfer all outstanding supply to the orderBook. Note: this amount should exceed the user deposits
        ///* Call depositOnBehalfOf() for each user and token

        for (uint256 i = 0; i < TOKEN_SUPPLIES.length; i++) {
            orderBook_instance.whitelistToken(tokenAdds[i]);

            for (uint256 j = 0; j < USERS.length; j++) {
                if (INITIAL_TOKEN_BALANCES[j][i] > 0) {
                    orderBook_instance.depositOnBehalfOf(
                        USERS[j],
                        address(tokenAdds[i]),
                        INITIAL_TOKEN_BALANCES[j][i] * scalar
                    );
                }
            }
        }

        orderBook_instance.setupScenario();

        ///Return orderBook address
        return address(orderBook_instance);
    }

    ///Does the player have enough TokenC tokens
    function validateInstance(address payable _instance, address _player)
        public
        view
        override
        returns (bool)
    {
        return
            OrderBook(_instance).getExternalBalance(_player, tokenAdds[2]) >=
            VERIFY_THRESHOLD_TOKEN_C;
    }
}
