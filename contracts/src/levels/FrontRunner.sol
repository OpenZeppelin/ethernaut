// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "openzeppelin-contracts-v5.4.0/token/ERC20/ERC20.sol";

/// @notice A plain ERC20. Alice approved the player as a spender, and is
/// about to cut that approval down. approve() always overwrites the
/// allowance instead of adjusting it relative to what's already been spent,
/// so nothing stops the spender from draining the old allowance right
/// before the new, lower one lands, then draining the new one too.
contract FrontRunner is ERC20 {
    address public immutable alice;
    address public immutable player;
    uint256 public immutable reducedAllowance;
    bool public aliceReduced;

    constructor(
        address _alice,
        address _player,
        uint256 initialSupply,
        uint256 initialAllowance,
        uint256 _reducedAllowance
    ) ERC20("Alice Token", "ALT") {
        alice = _alice;
        player = _player;
        reducedAllowance = _reducedAllowance;
        _mint(alice, initialSupply);
        _approve(alice, player, initialAllowance);
    }

    /// @notice Alice, having noticed the spender could drain more than she's
    /// comfortable with, tries to cut the allowance down to a safer amount.
    /// Callable once per instance: it mirrors the single allowance-reducing
    /// transaction a real token owner would send.
    function triggerAliceReduce() external {
        require(!aliceReduced, "Alice already reduced her allowance");
        aliceReduced = true;
        _approve(alice, player, reducedAllowance);
    }
}
